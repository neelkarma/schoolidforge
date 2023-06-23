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
                  onPressed: () => _showStudentIdInfo(context),
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
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Cancel"),
                ),
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

  Future<void> _showStudentIdInfo(BuildContext context) async {
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
