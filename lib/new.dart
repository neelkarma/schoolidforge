import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:schoolidforge/utils.dart';

class NewBarcodeScreen extends StatelessWidget {
  NewBarcodeScreen({super.key});

  // SBHS student IDs use Code128 barcodes.
  final _controller = MobileScannerController(formats: [BarcodeFormat.code128]);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Scan New Student ID"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Position the ID card barcode in the frame below:",
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              Container(
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(16)),
                ),
                clipBehavior: Clip.hardEdge,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxHeight: 250),
                  child: MobileScanner(
                    controller: _controller,
                    onDetect: (capture) => _handleDetect(context, capture),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                child: const Text('Enter manually instead'),
                onPressed: () => _manualEntry(context),
              )
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _manualEntry(BuildContext context) async {
    // See similar line in _handleDetect
    _controller.stop();

    Navigator.pop(
      context,
      await Navigator.push<BarcodeInfo>(
        context,
        MaterialPageRoute(
          builder: (context) => EditScreen.blank(),
        ),
      ),
    );
  }

  Future<void> _handleDetect(
      BuildContext context, BarcodeCapture capture) async {
    for (final barcode in capture.barcodes) {
      if (barcode.rawValue == null || !isValid(barcode.rawValue)) {
        debugPrint("Invalid barcode!");
        continue;
      }

      // This fixes duplicate edit screens as a result of detection happening even after navigation.
      // It isn't the best solution, as it prevents us from using the NewBarcodeScreen instance again after detecting one barcode. Too bad!
      _controller.stop();

      Navigator.pop(
        context,
        await Navigator.push<BarcodeInfo>(
          context,
          MaterialPageRoute(
            builder: (context) => EditScreen.fromStudentId(barcode.rawValue!),
          ),
        ),
      );
      break;
    }
  }
}
