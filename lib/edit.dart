import 'package:flutter/material.dart';
import 'package:schoolidforge/db.dart';
import 'package:schoolidforge/utils.dart';

class EditScreen extends StatelessWidget {
  const EditScreen(this.barcInfo, {super.key});
  EditScreen.fromStudentId(String studentId, {super.key})
      : barcInfo = BarcodeInfo(studentId, "");
  EditScreen.blank({super.key}) : barcInfo = BarcodeInfo("", "");

  final BarcodeInfo barcInfo;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Edit Student ID")),
      body: EditForm(barcInfo),
    );
  }
}

class EditForm extends StatefulWidget {
  const EditForm(this.barcInfo, {super.key});

  final BarcodeInfo barcInfo;

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
        padding: const EdgeInsets.all(8),
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
                  return "Please enter a name.";
                }
                return null;
              },
            ),
            const SizedBox(height: 10),
            TextFormField(
              decoration: const InputDecoration(
                border: UnderlineInputBorder(),
                labelText: "Student ID",
              ),
              keyboardType: TextInputType.number,
              controller: _studentIdController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "Please enter an ID.";
                }
                if (!isValid(value)) {
                  return "Invalid Student ID.";
                }
                return null;
              },
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _submit,
              child: const Text("Save"),
            ),
          ],
        ),
      ),
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    Navigator.pop(
      context,
      BarcodeInfo(
        _studentIdController.text,
        _nameController.text,
        id: widget.barcInfo.id,
      ),
    );
  }
}
