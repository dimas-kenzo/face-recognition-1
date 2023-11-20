<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\FaceDescriptor;
use Illuminate\Support\Facades\Auth;

class FaceDescriptorController extends Controller
{
    public function index()
    {
        // Tampilkan halaman untuk mendeteksi wajah
        return view('face.index');
    }

    public function store(Request $request)
    {
        try {
            $imageData = $request->input('imageData');

            // Mendekode data base64 menjadi binary
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imageData));

            $user = User::find(1);

            $faceDescriptor = new FaceDescriptor();
            $faceDescriptor->user_id = $user->id;

            $imageName = $user->name . '.' . 'png';
            $path = storage_path('app/public/images/' . $imageName);
            file_put_contents($path, $imageData);


            file_put_contents($path, $imageData);

            // Menyimpan path gambar ke dalam kolom descriptor
            $faceDescriptor->descriptor = $path;

            $faceDescriptor->save();

            return response()->json(['message' => 'Frame captured and saved to the database']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500); // Mengembalikan pesan kesalahan dengan status code 500
        }
    }

    
}
