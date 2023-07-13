import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/edit.dart';
import 'package:schoolidforge/utils.dart';

const scanRoute = "scan";
const editRoute = "edit";

class NewBarcodeFlow extends StatefulWidget {
  static State<NewBarcodeFlow> of(BuildContext context) =>
      context.findAncestorStateOfType<_NewBarcodeFlowState>()!;

  const NewBarcodeFlow({super.key});

  @override
  State<NewBarcodeFlow> createState() => _NewBarcodeFlowState();
}

class _NewBarcodeFlowState extends State<NewBarcodeFlow> {
  final _navigatorKey = GlobalKey<NavigatorState>();

  void _onScanComplete(String? studentId) {
    _navigatorKey.currentState!.pushNamed(editRoute, arguments: studentId);
  }

  void _onEditComplete(BarcodeInfo barcInfo) {
    Navigator.of(context).pop(barcInfo);
  }

  Route _onGenerateRoute(RouteSettings settings) {
    late Widget page;

    switch (settings.name) {
      case scanRoute:
        page = ScanRoute(onComplete: _onScanComplete);
        break;
      case editRoute:
        final studentId = settings.arguments as String?;
        if (studentId == null) {
          page = EditForm.blank(
            onSubmit: _onEditComplete,
          );
        } else {
          page = EditForm.fromStudentId(
            studentId: studentId,
            onSubmit: _onEditComplete,
          );
        }
        break;
    }

    return MaterialPageRoute(
      builder: (context) => page,
      settings: settings,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add New Student ID"),
      ),
      body: Navigator(
        key: _navigatorKey,
        initialRoute: scanRoute,
        onGenerateRoute: _onGenerateRoute,
      ),
    );
  }
}

class ScanRoute extends StatefulWidget {
  static State<ScanRoute> of(BuildContext context) {
    return context.findAncestorStateOfType<_ScanRouteState>()!;
  }

  const ScanRoute({super.key, required this.onComplete});

  final void Function(String? studentId) onComplete;

  @override
  State<ScanRoute> createState() => _ScanRouteState();
}

class _ScanRouteState extends State<ScanRoute> {
  // SBHS student IDs use Code128 barcodes.
  final _controller = MobileScannerController(formats: [BarcodeFormat.code128]);

  @override
  Widget build(BuildContext context) {
    return Padding(
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
                  onDetect: _handleDetect,
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: _manualEntry,
              child: const Text('Enter manually instead'),
            )
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _controller.stop();
  }

  Future<void> _manualEntry() async {
    // See similar line in _handleDetect
    _controller.stop();
    widget.onComplete(null);
  }

  Future<void> _handleDetect(BarcodeCapture capture) async {
    for (final barcode in capture.barcodes) {
      if (barcode.rawValue == null || !isValid(barcode.rawValue)) {
        debugPrint("Invalid barcode!");
        continue;
      }

      // This fixes duplicate edit screens as a result of detection happening even after navigation.
      // It isn't the best solution, as it prevents us from using the NewBarcodeScreen instance again after detecting one barcode. Too bad!
      _controller.stop();

      widget.onComplete(barcode.rawValue!);
      break;
    }
  }
}
