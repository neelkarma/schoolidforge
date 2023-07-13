import 'dart:typed_data';

import 'package:barcode_image/barcode_image.dart';
import 'package:barcode_widget/barcode_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_file_dialog/flutter_file_dialog.dart';
import 'package:image/image.dart' as img;
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:schoolidforge/utils.dart';
import 'package:screen_brightness/screen_brightness.dart';
import 'package:wakelock/wakelock.dart';

class ViewScreen extends StatefulWidget {
  static State<ViewScreen> of(BuildContext context) =>
      context.findAncestorStateOfType<_ViewScreenState>()!;

  const ViewScreen(this.barcInfo, {super.key});

  final BarcodeInfo barcInfo;

  @override
  State<ViewScreen> createState() => _ViewScreenState();
}

class _ViewScreenState extends State<ViewScreen> {
  final _db = BarcodeInfoDatabase.instance;
  late BarcodeInfo _barcInfo;
  double _barcWidth = 0.5;

  @override
  void initState() {
    super.initState();
    _barcInfo = widget.barcInfo;
    Wakelock.enable();
    ScreenBrightness().setScreenBrightness(1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${_barcInfo.name} (${_barcInfo.studentId})"),
        actions: [
          IconButton(
            onPressed: _edit,
            icon: const Icon(Icons.edit),
          ),
          IconButton(
            onPressed: _export,
            icon: const Icon(Icons.save),
          ),
          IconButton(
            onPressed: _delete,
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
            Slider(
              min: 0.2,
              max: 1,
              value: _barcWidth,
              onChanged: (value) {
                setState(() {
                  _barcWidth = value;
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    Wakelock.disable();
    ScreenBrightness().resetScreenBrightness();
  }

  Future<void> _edit() async {
    final newBarcInfo = await Navigator.push<BarcodeInfo>(
      context,
      MaterialPageRoute(builder: (context) => EditScreen(barcInfo: _barcInfo)),
    );
    if (newBarcInfo == null) return;
    await _db.update(newBarcInfo);
    setState(() => _barcInfo = newBarcInfo);
  }

  Future<void> _export() async {
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

  Future<void> _delete() async {
    final confirmed = await confirmDialog(
        context, "Are you sure you want to delete \"${_barcInfo.name}\"?");

    if (!confirmed) return;
    await _db.delete(_barcInfo.id!);
    if (context.mounted) Navigator.pop(context);
  }
}
