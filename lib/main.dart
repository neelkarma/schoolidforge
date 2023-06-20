import "package:flutter/material.dart";
import "package:schoolidforge/db.dart";
import "package:schoolidforge/new.dart";
import "package:schoolidforge/utils.dart";
import "package:schoolidforge/view.dart";
import "package:url_launcher/url_launcher.dart";

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await BarcodeInfoDatabase.instance.init();
  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "School IDForge",
      theme: ThemeData.light(useMaterial3: true),
      darkTheme: ThemeData.dark(useMaterial3: true),
      home: const HomePage(),
    );
  }
}

enum HomePagePopupActions { deleteAll, about }

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _db = BarcodeInfoDatabase.instance;
  var _studentsFut = BarcodeInfoDatabase.instance.getAll();
  var _searchIsActive = false;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.addListener(
      () => setState(() {}),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _searchController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (!_searchIsActive) return true;
        setState(() {
          _searchController.clear();
          _searchIsActive = false;
        });
        return false;
      },
      child: Scaffold(
        appBar: AppBar(
          title: _searchIsActive
              ? TextField(
                  controller: _searchController,
                  autofocus: true,
                  decoration: const InputDecoration(hintText: "Search..."),
                )
              : const Text("School IDForge"),
          actions: [
            IconButton(
              icon: _searchIsActive
                  ? const Icon(Icons.close)
                  : const Icon(Icons.search),
              onPressed: () => setState(() {
                _searchController.clear();
                _searchIsActive = !_searchIsActive;
              }),
            ),
            PopupMenuButton(
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: HomePagePopupActions.deleteAll,
                  child: Text("Delete All"),
                ),
                const PopupMenuItem(
                  value: HomePagePopupActions.about,
                  child: Text("About"),
                )
              ],
              onSelected: (value) {
                switch (value) {
                  case HomePagePopupActions.deleteAll:
                    _handleDeleteAll();
                    return;
                  case HomePagePopupActions.about:
                    _handleAbout();
                    return;
                }
              },
            )
          ],
        ),
        body: FutureBuilder(
          future: _studentsFut,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.data!.isEmpty) {
              return const Center(
                child: Text(
                    "Forge your first student ID by clicking the '+' below!"),
              );
            }

            // Search filtering
            final students = snapshot.data!
                .where((student) =>
                    student.name
                        .toLowerCase()
                        .contains(_searchController.text.toLowerCase()) ||
                    student.studentId.contains(_searchController.text))
                .toList();

            if (students.isEmpty) {
              return const Center(
                child: Text("No results found."),
              );
            }

            return ListView.separated(
              itemCount: students.length,
              itemBuilder: (context, index) =>
                  _buildStudentTile(students[index]),
              separatorBuilder: (context, index) => const Divider(),
            );
          },
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _new,
          child: const Icon(Icons.add),
        ),
      ),
    );
  }

  Widget _buildStudentTile(BarcodeInfo student) {
    return Dismissible(
      key: Key(student.id!.toString()),
      background: _buildDismissibleBackground(DismissDirection.startToEnd),
      secondaryBackground:
          _buildDismissibleBackground(DismissDirection.endToStart),
      child: ListTile(
        onTap: () async {
          await Navigator.push<bool>(
            context,
            MaterialPageRoute(
              builder: (context) => ViewScreen(student),
            ),
          );
          _triggerRefresh();
        },
        title: Text(student.name),
        subtitle: Text(student.studentId),
      ),
      confirmDismiss: (direction) async {
        return confirmDialog(
            context, "Are you sure you want to delete \"${student.name}\"?");
      },
      onDismissed: (direction) async {
        await _db.delete(student.id!);
        _triggerRefresh();
      },
    );
  }

  Widget _buildDismissibleBackground(DismissDirection direction) {
    return Container(
      color: Colors.red,
      child: Align(
        alignment: direction == DismissDirection.startToEnd
            ? Alignment.centerLeft
            : Alignment.centerRight,
        child: Padding(
          padding: direction == DismissDirection.startToEnd
              ? const EdgeInsets.only(left: 16)
              : const EdgeInsets.only(right: 16),
          child: const Icon(
            Icons.delete,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Future<void> _handleDeleteAll() async {
    final confirmation = await confirmDialog(context,
        "Are you sure you want to delete all saved student IDs? This action is irreversible.");

    if (confirmation) {
      await _db.deleteAll();
      _triggerRefresh();
    }
  }

  void _handleAbout() {
    showAboutDialog(
      context: context,
      children: [
        const Text("Made by iamkneel"),
        ElevatedButton(
          onPressed: () => launchUrl(
            Uri.parse("https://github.com/neelkarma/schoolidforge"),
          ),
          child: const Text("Source"),
        )
      ],
    );
  }

  void _triggerRefresh() {
    _studentsFut = _db.getAll();
    setState(() {});
  }

  Future<void> _new() async {
    final newBarcode = await Navigator.push<BarcodeInfo>(
      context,
      MaterialPageRoute(
        builder: (context) => NewBarcodeScreen(),
      ),
    );
    if (newBarcode == null) return;
    await _db.insert(newBarcode);
    _triggerRefresh();
  }
}
