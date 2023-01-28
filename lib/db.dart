import 'package:sqflite/sqflite.dart';

const String dbPath = "data.db";
const String table = "barcodes";
const String idColumn = "id";
const String studentIdColumn = "student_id";
const String nameColumn = "name";

class BarcodeInfo {
  int? id;
  late String studentId;
  late String name;

  Map<String, Object?> toMap() {
    var map = <String, Object?>{studentIdColumn: studentId, nameColumn: name};
    if (id != null) {
      map[idColumn] = id;
    }
    return map;
  }

  BarcodeInfo(this.studentId, this.name, {this.id});

  BarcodeInfo.fromMap(Map<String, Object?> map) {
    studentId = map[studentIdColumn] as String;
    name = map[nameColumn] as String;
    id = map[idColumn] as int?;
  }
}

class BarcodeInfoDatabase {
  static final BarcodeInfoDatabase _instance = BarcodeInfoDatabase._create();

  late Database _db;

  BarcodeInfoDatabase._create();

  Future init() async {
    _db = await openDatabase(
      dbPath,
      version: 1,
      onCreate: (Database db, int version) async => await db.execute(
        """
          CREATE TABLE $table (
            $idColumn INTEGER PRIMARY KEY AUTOINCREMENT,
            $studentIdColumn TEXT NOT NULL,
            $nameColumn TEXT NOT NULL
          )
        """,
      ),
    );
  }

  static BarcodeInfoDatabase get instance => _instance;

  Future<List<BarcodeInfo>> getAll() async {
    final res = await _db
        .query(table, columns: [idColumn, studentIdColumn, nameColumn]);
    return res.map(BarcodeInfo.fromMap).toList();
  }

  Future<BarcodeInfo?> get(int id) async {
    final maps = await _db.query(
      table,
      columns: [idColumn, studentIdColumn, nameColumn],
      where: "$idColumn = ?",
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return BarcodeInfo.fromMap(maps.first);
    }

    return null;
  }

  Future<BarcodeInfo> insert(BarcodeInfo barcInfo) async {
    barcInfo.id = await _db.insert(table, barcInfo.toMap());
    return barcInfo;
  }

  Future<int> delete(int id) async {
    return await _db.delete(
      table,
      where: "$idColumn = ?",
      whereArgs: [id],
    );
  }

  Future<int> deleteAll() async {
    return await _db.delete(table);
  }

  Future<int> update(BarcodeInfo barcInfo) async {
    return await _db.update(
      table,
      barcInfo.toMap(),
      where: "$idColumn = ?",
      whereArgs: [barcInfo.id],
    );
  }

  Future close() => _db.close();
}
