import 'package:flutter/material.dart';

/// Checks if a given student ID is valid.
bool isValid(String? studentId) {
  return studentId != null &&
      studentId.length == 9 &&
      int.tryParse(studentId) != null;
}

/// Displays a generic confirmation dialog.
Future<bool> confirmDialog(BuildContext context, String content) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text("Confirmation"),
      content: Text(content),
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
        )
      ],
    ),
  );

  return result ?? false;
}
