import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:schoolidforge/utils.dart';

class NewBarcodeScreen extends StatelessWidget {
  NewBarcodeScreen({super.key});

  // SBHS student IDs all have Code128 barcodes.
  final _controller = MobileScannerController(formats: [BarcodeFormat.code128]);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Scan New Student ID"),
      ),
      floatingActionButton: Align(
        alignment: Alignment.bottomRight,
        child: Wrap(
          direction: Axis.horizontal,
          spacing: 12,
          children: [
            FloatingActionButton.extended(
              onPressed: () => _manualEntry(context),
              label: const Text("Enter Manually"),
            ),
            FloatingActionButton(
              heroTag: null,
              onPressed: _controller.switchCamera,
              child: ValueListenableBuilder(
                valueListenable: _controller.cameraFacingState,
                builder: (context, value, child) {
                  switch (value) {
                    case CameraFacing.back:
                      return const Icon(Icons.camera_front);
                    case CameraFacing.front:
                      return const Icon(Icons.camera_rear);
                  }
                },
              ),
            ),
            FloatingActionButton(
              heroTag: null,
              onPressed: _controller.toggleTorch,
              child: ValueListenableBuilder(
                valueListenable: _controller.torchState,
                builder: (context, value, child) {
                  switch (value) {
                    case TorchState.off:
                      return const Icon(Icons.flash_on);
                    case TorchState.on:
                      return const Icon(Icons.flash_off);
                  }
                },
              ),
            ),
          ],
        ),
      ),
      body: MobileScanner(
        controller: _controller,
        onDetect: (capture) => _handleDetect(context, capture),
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
