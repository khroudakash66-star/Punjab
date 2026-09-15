import 'package:flutter/material.dart';

void main() {
  runApp(const InstagramCloneApp());
}

class InstagramCloneApp extends StatelessWidget {
  const InstagramCloneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Instagram Clone',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: Colors.black,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  // ਵੱਖ-ਵੱਖ ਪੰਨੇ (Screens)
  final List<Widget> _pages = [
    const HomeScreen(),
    const SearchScreen(),
    const ReelsScreen(),
    const ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        type: BottomNavigationBarType.fixed,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home, size: 28), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.search, size: 28), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.movie_outlined, size: 28), label: 'Reels'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline, size: 28), label: 'Profile'),
        ],
      ),
    );
  }
}

// 1. ਹੋਮ ਸਕ੍ਰੀਨ (Home Screen)
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text('Instagram', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
        actions: [
          IconButton(icon: const Icon(Icons.favorite_border), onPressed: () {}),
          IconButton(icon: const Icon(Icons.chat_bubble_outline), onPressed: () {}),
        ],
      ),
      body: ListView(
        children: [
          // ਸਟੋਰੀਜ਼
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 8,
              itemBuilder: (context, index) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.pink,
                        child: CircleAvatar(
                          radius: 27,
                          backgroundImage: NetworkImage('https://picsum.photos/id/${index + 10}/200/200'),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text('User ${index + 1}', style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                );
              },
            ),
          ),
          const Divider(color: Colors.grey, height: 1),
          // ਪੋਸਟਾਂ
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3,
            itemBuilder: (context, index) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage('https://picsum.photos/id/${index + 20}/200/200'),
                    ),
                    title: Text('user_${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    trailing: const Icon(Icons.more_vert),
                  ),
                  Container(
                    height: 300,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage('https://picsum.photos/id/${index + 40}/400/400'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(icon: const Icon(Icons.favorite_border), onPressed: () {}),
                      IconButton(icon: const Icon(Icons.chat_bubble_outline), onPressed: () {}),
                      IconButton(icon: const Icon(Icons.send), onPressed: () {}),
                      const Spacer(),
                      IconButton(icon: const Icon(Icons.bookmark_border), onPressed: () {}),
                    ],
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12.0),
                    child: Text('1,450 likes', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 12),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

// 2. ਸਰਚ ਸਕ੍ਰੀਨ (Search / Explore)
class SearchScreen extends StatelessWidget {
  const SearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[800],
            borderRadius: BorderRadius.circular(10),
          ),
          child: const TextField(
            decoration: InputDecoration(
              hintText: 'Search',
              prefixIcon: Icon(Icons.search, color: Colors.grey),
              border: InputBorder.none,
            ),
          ),
        ),
      ),
      body: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 2,
          mainAxisSpacing: 2,
        ),
        itemCount: 30,
        itemBuilder: (context, index) {
          return Image.network(
            'https://picsum.photos/id/${index + 60}/200/200',
            fit: BoxFit.cover,
          );
        },
      ),
    );
  }
}

// 3. ਰੀਲਜ਼ ਸਕ੍ਰੀਨ (Reels Screen)
class ReelsScreen extends StatelessWidget {
  const ReelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage('https://picsum.photos/id/100/400/800'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Positioned(
            bottom: 20,
            left: 20,
            right: 20,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('@punjabi_reels', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                SizedBox(height: 8),
                Text('ਇਹ ਇੱਕ ਰੀਲ ਵੀਡੀਓ ਦਾ ਡਿਜ਼ਾਈਨ ਹੈ! 🎵🔥'),
              ],
            ),
          ),
          Positioned(
            right: 15,
            bottom: 40,
            child: Column(
              children: const [
                Icon(Icons.favorite, size: 35, color: Colors.red),
                Text('12.5K'),
                SizedBox(height: 20),
                Icon(Icons.comment, size: 35),
                Text('430'),
                SizedBox(height: 20),
                Icon(Icons.share, size: 35),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// 4. ਪ੍ਰੋਫਾਈਲ ਸਕ੍ਰੀਨ (Profile Screen)
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text('my_instagram_profile', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.menu), onPressed: () {}),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage('https://picsum.photos/id/237/200/200'),
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: const [
                      Column(children: [Text('15', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)), Text('Posts')]),
                      Column(children: [Text('1.2K', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)), Text('Followers')]),
                      Column(children: [Text('340', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)), Text('Following')]),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Text('ਵਿਅਕਤੀਗਤ ਪ੍ਰੋਫਾਈਲ ਬਾਇਓ 🚀\nFlutter Developer 💻', style: TextStyle(fontSize: 14)),
          ),
          const SizedBox(height: 15),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 2,
                mainAxisSpacing: 2,
              ),
              itemCount: 9,
              itemBuilder: (context, index) {
                return Image.network(
                  'https://picsum.photos/id/${index + 120}/200/200',
                  fit: BoxFit.cover,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
