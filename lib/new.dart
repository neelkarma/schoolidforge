import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:schoolidforge/utils.dart';

class NewBarcodeScreen extends StatelessWidget {
  NewBarcodeScreen({super.key});

  final _cameraController =
      MobileScannerController(formats: [BarcodeFormat.code128]);

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
          children: [
            Container(
              margin: const EdgeInsets.all(8),
              child: FloatingActionButton.extended(
                onPressed: () async {
                  Navigator.pop(
                    context,
                    await Navigator.push<BarcodeInfo>(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EditScreen.blank(),
                      ),
                    ),
                  );
                },
                label: const Text("Enter Manually"),
              ),
            ),
            Container(
              margin: const EdgeInsets.all(8),
              child: FloatingActionButton(
                heroTag: null,
                onPressed: () => _cameraController.switchCamera(),
                child: ValueListenableBuilder(
                  valueListenable: _cameraController.cameraFacingState,
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
            ),
            Container(
              margin: const EdgeInsets.all(8),
              child: FloatingActionButton(
                heroTag: null,
                onPressed: () => _cameraController.toggleTorch(),
                child: ValueListenableBuilder(
                  valueListenable: _cameraController.torchState,
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
            ),
          ],
        ),
      ),
      body: MobileScanner(
        controller: _cameraController,
        allowDuplicates: false,
        onDetect: (barcode, args) async {
          if (barcode.rawValue == null || !isValid(barcode.rawValue)) {
            debugPrint("Invalid barcode!");
            return;
          }
          Navigator.pop(
            context,
            await Navigator.push<BarcodeInfo>(
              context,
              MaterialPageRoute(
                builder: (context) =>
                    EditScreen.fromStudentId(barcode.rawValue!),
              ),
            ),
          );
        },
      ),
    );
  }
}
