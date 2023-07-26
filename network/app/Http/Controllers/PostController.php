<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //to get user's posts $user->posts
        //return response()->json($user->posts);
        //to get all users' posts
        $posts = Post::all();
        return response()->json($posts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $fileName = $request->input('id') . '.' . $request->image->extension();
        $request->image->storeAs('public/images', $fileName);

        $post = new Post;
        $post -> id = $request->input('id');
        $post -> title = $request->input('title');
        $post -> content = $request->input('content');
        $post -> user_id = $request->input('user_id');
        $post -> image = $fileName;
        $post -> save();

        return response()->json($post);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
