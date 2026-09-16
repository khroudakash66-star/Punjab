import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(); // ਕਲਾਉਡ (Firebase) ਨਾਲ ਕਨੈਕਸ਼ਨ
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ਜੁੜੀ ਓਏ',
      theme: ThemeData(
        brightness: Brightness.dark, // ਪ੍ਰੀਮੀਅਮ ਡਾਰਕ ਥੀਮ
        primarySwatch: Colors.amber,
      ),
      home: LoginScreen(),
    );
  }
}

// 1. ਮੋਬਾਈਲ ਨੰਬਰ ਅਤੇ OTP ਲੌਗਇਨ ਸਕ੍ਰੀਨ
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  void _verifyPhoneNumber() async {
    String phoneNumber = "+91" + _phoneController.text.trim();
    
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (PhoneAuthCredential credential) async {
        await _auth.signInWithCredential(credential);
      },
      verificationFailed: (FirebaseAuthException e) {
        print("ਵੈਰੀਫਿਕੇਸ਼ਨ ਫੇਲ੍ਹ: ${e.message}");
      },
      codeSent: (String verificationId, int? resendToken) {
        // OTP ਭੇਜਣ ਤੋਂ ਬਾਅਦ ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ ਭੇਜਣ ਦਾ ਕੋਡ ਇੱਥੇ ਆਵੇਗਾ
        print("OTP ਭੇਜ ਦਿੱਤਾ ਗਿਆ ਹੈ!");
      },
      codeAutoRetrievalTimeout: (String verificationId) {},
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF121212),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'ਜੁੜੀ ਓਏ',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.amberAccent),
            ),
            SizedBox(height: 10),
            Text(
              'ਆਪਣੀਆਂ ਜੜ੍ਹਾਂ ਨਾਲ ਜੁੜੋ',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            SizedBox(height: 40),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: Icon(Icons.phone),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _verifyPhoneNumber,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber[800],
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text('OTP ਪ੍ਰਾਪਤ ਕਰੋ', style: TextStyle(fontSize: 18, color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }
}

// 2. ਫੋਟੋ ਅਪਲੋਡ ਕਰਨ ਅਤੇ ਕਲਾਉਡ ਵਿੱਚ ਸੇਵ ਕਰਨ ਵਾਲੀ ਸਕ੍ਰੀన్
class UploadScreen extends StatefulWidget {
  @override
  _UploadScreenState createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  File? _image;
  final ImagePicker _picker = ImagePicker();

  // ਫੋਨ ਦੀ ਗੈਲਰੀ ਵਿੱਚੋਂ ਫੋਟੋ ਚੁਣਨਾ
  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  // ਫੋਟੋ ਨੂੰ Firebase ਕਲਾਉਡ ਸਟੋਰੇਜ ਵਿੱਚ ਸੇਵ ਕਰਨਾ (ਕਦੇ ਨਾ ਉੱਡਣ ਲਈ)
  Future<void> _uploadImageToCloud() async {
    if (_image == null) return;
    try {
      String fileName = DateTime.now().millisecondsSinceEpoch.toString();
      Reference ref = FirebaseStorage.instance.ref().child('punjab_views/$fileName.jpg');
      
      await ref.putFile(_image!);
      String downloadUrl = await ref.getDownloadURL();
      
      print("ਫੋਟੋ ਕਲਾਉਡ ਵਿੱਚ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ: $downloadUrl");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('ਫੋਟੋ ਸਫ਼ਲਤਾਪੂਰਵਕ ਪੋਸਟ ਹੋ ਗਈ!')),
      );
    } catch (e) {
      print("ਅਪਲੋਡ ਕਰਨ ਵਿੱਚ ਗਲਤੀ: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('ਪੰਜਾਬ ਦਾ ਵਿਊ ਪਾਓ')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _image == null
                ? Text('ਕੋਈ ਫੋਟੋ ਨਹੀਂ ਚੁਣੀ ਗਈ', style: TextStyle(color: Colors.grey))
                : Image.file(_image!, height: 200),
            SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: Icon(Icons.image),
              label: Text('ਗੈਲਰੀ ਤੋਂ ਫੋਟੋ ਚੁਣੋ'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _uploadImageToCloud,
              style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              child: Text('ਕਲਾਉਡ ਵਿੱਚ ਅਪਲੋਡ ਕਰੋ'),
            ),
          ],
        ),
      ),
    );
  }
}
