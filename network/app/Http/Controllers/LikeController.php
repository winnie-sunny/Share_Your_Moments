<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $likes = Like::all();
            return response()->json($likes);
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
/*         if (request()->expectsJson()) {
            $like=Like::find($request->id);
            $like->likes=$request->likes;
            $like->save();
               return response()->json($like);
            } */
    }

    /**
     * Display the specified resource.
     */
    public function show(Like $like)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Like $like)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Like $like)
    {

            $like->likes=$request->likes;
            $like->save();
               
            return response()->json($like);
            
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Like $like)
    {
        //
    }
}