import "package:flutter/material.dart";
import "package:schoolidforge/db.dart";
import "package:schoolidforge/new.dart";
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("School IDForge"),
        actions: [
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
            onSelected: _action,
          )
        ],
      ),
      body: FutureBuilder(
        future: _db.getAll(),
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

          final barcInfoList = snapshot.data!;

          return ListView.separated(
            itemCount: barcInfoList.length,
            itemBuilder: (context, index) => ListTile(
              onTap: () async {
                await Navigator.push<bool>(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ViewScreen(barcInfoList[index]),
                  ),
                );
                setState(() {});
              },
              title: Text(barcInfoList[index].name),
              subtitle: Text(barcInfoList[index].studentId),
            ),
            separatorBuilder: (context, index) => const Divider(),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _new,
        child: const Icon(Icons.add),
      ),
    );
  }

  Future<void> _action(HomePagePopupActions value) async {
    switch (value) {
      case HomePagePopupActions.deleteAll:
        final confirmation = await showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text("Confirmation"),
            content: const Text(
                "Are you sure you want to delete all saved student IDs? This action is irreversible."),
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
        if (confirmation ?? false) {
          await _db.deleteAll();
          setState(() {});
        }
        return;
      case HomePagePopupActions.about:
        return showAboutDialog(
          context: context,
          children: [
            const Text("Made by iamkneel"),
            ElevatedButton(
              onPressed: () => launchUrl(
                Uri.parse("https://github.com/neelkarma"),
              ),
              child: const Text("GitHub"),
            )
          ],
        );
    }
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
    setState(() {});
  }
}
