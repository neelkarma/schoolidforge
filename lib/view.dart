import 'dart:typed_data';

import 'package:barcode_image/barcode_image.dart';
import 'package:barcode_widget/barcode_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_file_dialog/flutter_file_dialog.dart';
import 'package:image/image.dart' as img;
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:screen_brightness/screen_brightness.dart';
import 'package:wakelock/wakelock.dart';

class ViewScreen extends StatefulWidget {
  const ViewScreen(this.barcInfo, {super.key});

  final BarcodeInfo barcInfo;

  @override
  State<ViewScreen> createState() => _ViewScreenState();
}

class _ViewScreenState extends State<ViewScreen> {
  final _db = BarcodeInfoDatabase.instance;
  final _screenBright = ValueNotifier(false);
  late BarcodeInfo _barcInfo;
  double _barcWidth = 0.5;

  @override
  void initState() {
    super.initState();
    _barcInfo = widget.barcInfo;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${_barcInfo.name} (${_barcInfo.studentId})"),
        actions: [
          IconButton(
            onPressed: () => _edit(context),
            icon: const Icon(Icons.edit),
          ),
          IconButton(
            onPressed: () => _export(context),
            icon: const Icon(Icons.save),
          ),
          IconButton(
            onPressed: () => _delete(context),
            icon: const Icon(Icons.delete),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: FractionallySizedBox(
                widthFactor: _barcWidth,
                child: BarcodeWidget(
                  backgroundColor: Colors.white,
                  drawText: false,
                  padding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 30),
                  data: _barcInfo.studentId,
                  barcode: Barcode.code128(),
                ),
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: Slider(
                    min: 0.2,
                    max: 1,
                    value: _barcWidth,
                    onChanged: (value) {
                      setState(() {
                        _barcWidth = value;
                      });
                    },
                  ),
                ),
                IconButton(
                  onPressed: _toggleBright,
                  icon: ValueListenableBuilder(
                    valueListenable: _screenBright,
                    builder: (context, value, child) {
                      if (value) {
                        return const Icon(Icons.brightness_high);
                      } else {
                        return const Icon(Icons.brightness_low);
                      }
                    },
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    if (_screenBright.value) {
      _toggleBright();
    }
    super.dispose();
  }

  Future<void> _edit(BuildContext context) async {
    final newBarcInfo = await Navigator.push<BarcodeInfo>(
      context,
      MaterialPageRoute(builder: (context) => EditScreen(_barcInfo)),
    );
    if (newBarcInfo == null) return;
    await _db.update(newBarcInfo);
    setState(() => _barcInfo = newBarcInfo);
  }

  Future<void> _export(BuildContext context) async {
    final image = img.Image(width: 300, height: 120);
    img.fill(image, color: img.ColorRgb8(255, 255, 255));
    drawBarcode(
      image,
      Barcode.code128(),
      _barcInfo.studentId,
    );
    final filePath = await FlutterFileDialog.saveFile(
      params: SaveFileDialogParams(
        fileName: "${_barcInfo.name}-${_barcInfo.studentId}.png",
        data: Uint8List.fromList(img.encodePng(image)),
      ),
    );
    if (filePath == null) return;
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Student ID successfully exported!"),
        ),
      );
    }
  }

  Future<void> _delete(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Confirmation"),
        content: const Text("Are you sure you want to delete this student ID?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text(
              "Yes",
              style: TextStyle(color: Colors.redAccent),
            ),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("No"),
          ),
        ],
      ),
    );
    if (confirm == null || !confirm) return;
    await _db.delete(_barcInfo.id!);
    if (context.mounted) Navigator.pop(context);
  }

  Future<void> _toggleBright() async {
    if (_screenBright.value) {
      Wakelock.disable();
      await ScreenBrightness().resetScreenBrightness();
      _screenBright.value = false;
    } else {
      Wakelock.enable();
      await ScreenBrightness().setScreenBrightness(1);
      _screenBright.value = true;
    }
  }
}
