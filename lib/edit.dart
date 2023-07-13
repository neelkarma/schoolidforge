import 'package:flutter/material.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/utils.dart';

class EditScreen extends StatelessWidget {
  const EditScreen({super.key, required this.barcInfo});

  final BarcodeInfo barcInfo;

  void _onSubmit(BuildContext context, BarcodeInfo barcInfo) {
    Navigator.of(context).pop(barcInfo);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Student ID")),
      body: EditForm(
        barcInfo: barcInfo,
        onSubmit: (barcInfo) => _onSubmit(context, barcInfo),
      ),
    );
  }
}

class EditForm extends StatefulWidget {
  static State<EditForm> of(BuildContext context) =>
      context.findAncestorStateOfType<_EditFormState>()!;

  const EditForm({super.key, required this.barcInfo, required this.onSubmit});
  EditForm.fromStudentId(
      {super.key, required studentId, required this.onSubmit})
      : barcInfo = BarcodeInfo(studentId, "");
  EditForm.blank({super.key, required this.onSubmit})
      : barcInfo = BarcodeInfo("", "");

  final BarcodeInfo barcInfo;
  final Function(BarcodeInfo barcInfo) onSubmit;

  @override
  State<EditForm> createState() => _EditFormState();
}

class _EditFormState extends State<EditForm> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _studentIdController;
  late TextEditingController _nameController;

  @override
  void initState() {
    super.initState();
    _studentIdController =
        TextEditingController(text: widget.barcInfo.studentId);
    _nameController = TextEditingController(text: widget.barcInfo.name);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: "Name",
              ),
              controller: _nameController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "Please provide a name.";
                }
                return null;
              },
            ),
            TextFormField(
              decoration: InputDecoration(
                border: const UnderlineInputBorder(),
                labelText: "Student ID",
                suffixIcon: IconButton(
                  onPressed: _showStudentIdInfo,
                  icon: const Icon(Icons.info),
                ),
              ),
              keyboardType: TextInputType.number,
              controller: _studentIdController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "Please provide a student ID.";
                }
                if (!isValid(value)) {
                  return "Invalid Student ID.";
                }
                return null;
              },
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FilledButton(
                  onPressed: _submit,
                  child: const Text("Save"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showStudentIdInfo() async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Student ID"),
        content: const Text(
            "This is the 9-digit student ID that every student possesses. You can find it at the beginning of your school-issued email address or the bottom-left of your ID card."),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Ok"),
          )
        ],
      ),
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    widget.onSubmit(
      BarcodeInfo(
        _studentIdController.text,
        _nameController.text,
        id: widget.barcInfo.id,
      ),
    );
  }
}
