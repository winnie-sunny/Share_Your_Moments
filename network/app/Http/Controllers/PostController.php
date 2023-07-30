<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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


/*         if($user){
            if(Auth::id() != $user->id){
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            return response()->json($user->posts);
        }
        else{ */
            $posts = Post::all();
            return response()->json($posts);

        //}
    }

    /**
     * Show the form for creating a new resource.
     */
    //public function create()
    //{
        //
    //}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        Log::info($request);
        $post = new Post;
        if($request->hasFile('file')){
            $fileName = time() . '.' . $request->file->getClientOriginalExtension();
            $request->file->move(public_path('images'), $fileName);
            $post -> image = 'http://localhost:8000/images/' . $fileName;
        }

        $post -> title = $request->title;
        $post -> content = $request->content;
        $post -> user_id = Auth::id();

        $post -> save();
        return response()->json($post);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, Post $post)
    {
        if (Auth::id() !== $post->user_id){
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        return response()->json($post);
    }

    /**
     * Show the form for editing the specified resource.
     */
    //public function edit(Post $post)
    //{
        //
    //}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        if(Auth::id() !== $post->user_id){
            return response()->json(['error' => 'Unauthorized',403]);
        }

        $post->title = $request->title;
        $post->content = $request->content;
        $post->image = $request->image;
        $post->save();

        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if(Auth::id() !== $post->user_id){
            return response()->json(['error' => 'Unauthorized',403]);
        }

        $post->delete();

        return response($post);
    }
}
