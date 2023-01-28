bool isValid(String? studentId) {
  return studentId != null &&
      studentId.length == 9 &&
      int.tryParse(studentId) != null;
}
