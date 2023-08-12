const baseUrl = 'http://127.0.0.1:8000'
const app = Vue.createApp({
  data: function () {
    return {
      title: 'Share Your Moments',
      token: '',
      user: {},
      posts: [],
      comments: [],
      comment:{
        post_id:'',
        content:''
      },
      likes: [],
      like: {
        id:'',
        likes: ''
      },
      addLike: {
        id:'',
        likes:'0'
      },
      disables: [],
      disabled: false,
      file:null,
      showNewPost: false,
      showEditPost: false,
      showComments: false,
      loginForm: {
        email: '',
        password: ''
      },
      postForm: {
        title: '',
        content: ''
        //image: ''
      },
      editForm: {
        id: '',
        title: '',
        content: '',
        image: ''
      },
      errors: {}
    }
  },

  created: async function () { 
    this.token = sessionStorage.getItem('token') || ''
    this.user = JSON.parse(sessionStorage.getItem('user') || {})
    this.getPosts()
  },

  methods: {
    login: async function () {
      try {
        const response = await fetch(`${baseUrl}/login`,{
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        })

        const json = await response.json()
        this.token = json.token
        this.user = json.user
        sessionStorage.setItem('token',this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))
        this.getPosts()
      } catch (error){
        console.log(error)
      }
    },

    getPosts: async function () {
        try {
        if (this.user.id && this.token){
          const response = await fetch(`${baseUrl}/api/user/${this.user.id}/posts`, {
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.token}`
            }
          })
          this.posts = await response.json()
          await this.getLikes()

          for(let i =0; i<this.posts.length;i++){
            this.posts[i]['likes'] = this.likes[i].likes
            for(let j = 0; j < this.disables.length;j++){
              if (this.posts[i].id==this.disables[j]){
                this.posts[i].disabled = true
                break
              }
              
              this.posts[i].disabled =false

            }
          }


      }
      } catch(error){
        console.log(error)

      }  
    },

    getComments: async function(post) {
      try{
        this.comment.post_id = post.id
        this.comments = [];
        const response = await fetch(`${baseUrl}/api/post/${post.id}/comments`, {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })
        this.comments = await response.json()
      } catch(error){
        console.log(error)
      }
      
    },

    onFileChange: function(e){
      this.file = e.target.files[0]
      //console.log(this.file.files)
    },

    addPost: async function (e) {
      try{
        e.preventDefault()
        
        formData = new FormData()
        if(this.file){
          formData.append('file', this.file)
        }
        //add validation
        if(!this.postForm.title){
          this.errors.post_title = "The title of your post can not be empty."
        }
        else if(this.postForm.title.length <3 || this.postForm.title.length >60){
          this.errors.post_title = "The length of title should be between 3-60 characters.."
          
        }

        if(!this.postForm.content){
          this.errors.post_content = "The content of your post can not be empty."
          
        }
        else if(this.postForm.content.length < 6 || this.postForm.title.length >300){
          this.errors.post_content = "The length of content should be between 6-300 characters."
          
        }
        else{
          formData.append('title',this.postForm.title)
          formData.append('content',this.postForm.content)

          config = {
            headers: {
              'Content-Type':'multipart/form-data',
              'Authorization': `Bearer ${this.token}`
            }
          }
          await axios.post(`${baseUrl}/api/user/${this.user.id}/posts`,formData,config).then(function (response){
            newpost = response.data
          })
      
        this.file = null
        this.postForm= {
          title: '',
          content: ''
        } 
        const json = newpost
        json.likes = 0
        json.disabled = false
      //console.log(newpost)
        this.posts.push(json)
        this.showNewPost = false
        this.errors = {}
        this.createLike(newpost)
         }

        
      }catch(error){
        console.log(error)
      }  
    },

    editPost: function (post) {
      this.editForm.title = post.title
      this.editForm.content = post.content
      this.editForm.id = post.id
      this.errors = {}
    },

    updatePost: async function (e) {
      try{
        e.preventDefault()
        //add validation
        if(!this.editForm.title){
          this.errors.post_title = "The title of your post can not be empty."
          
        }
        else if(this.editForm.title.length <3 || this.editForm.title.length >60){
          this.errors.post_title = "The length of title should be between 3-60 characters."
          
        }

        if(!this.editForm.content){
          this.errors.post_content = "The content of your post can not be empty."
         
        }
        else if(this.editForm.content.length < 6 || this.editForm.title.length >300){
          this.errors.post_content = "The length of content should be between 6-300 characters."
          
        }
        else{
          updateData = new FormData()
          if(this.file){
            updateData.append('file', this.file)
          }
          updateData.append('title',this.editForm.title)
          updateData.append('content',this.editForm.content)
          updateData.append('id',this.editForm.id)
          updateData.append('_method', 'PUT')

            config = {
            headers: {
              'Content-Type':'multipart/form-data',
              'Authorization': `Bearer ${this.token}`
            }
          }
          await axios.post(`${baseUrl}/api/posts/${this.editForm.id}`,updateData,config).then(function (response){
            newpost = response.data
          })  

        this.file = null
        this.showEditPost = false
        this.errors = {}
        this.getPosts()
        }

        
        
      }catch(error){
        console.log(error)
      }  
    },

    deletePost: async function (post) {
      try {
        if (this.user.id && this.token && confirm("Are you sure to delete this post ?")){
          const response = await fetch(`${baseUrl}/api/posts/${post.id}`,{
            method: 'delete',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.token}`
            },
            //body: JSON.stringify(post)
          })
          const json = await response.json()
          this.getPosts()
          //this.getPosts()
        }


      } catch (error){
        console.log(error)
      }
    },

    addComment: async function () {
      try {
      if (this.user.id && this.token){
        if(!this.comment.content){
          this.errors.comment = "Your comment can not be empty."
        }
        else if(this.comment.content.length < 5 || this.comment.content.length >100){
          this.errors.comment = "Your comment must be between 5 and 100 characters."
        }
        else{
          const response = await fetch(`${baseUrl}/api/post/${this.comment.post_id}/comments`, {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(this.comment)
          })
          const newcomment = await response.json()
          this.comments.push(newcomment)
          this.comment.content = ''
          this.errors = {}
        }
        
    }
    } catch(error){
      console.log(error)

    }  
  },

  iLikeIt: async function(post){

    try {
      if (this.user.id && this.token){
        id = Number(post.id)
        //let before = this.likes[id]['likes']
        this.disables.push(id)
        this.like.id = id
        for(let i = 0 ; i < this.likes.length; i++){
          if(this.likes[i].id == id){
            this.like.likes = Number(this.likes[i].likes) + 1
            break
          }
        }
        this.like['_method'] = 'PUT'
        // likeData = new FormData()
        // likeData.append('likes',this.like.likes)
        // likeData.append('id',this.like.id)
        // likeData.append('_method', 'PUT')
        config = {
          headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        }
        await axios.post(`${baseUrl}/api/like/${post.id}`,JSON.stringify(this.like),config).then(function (response){
          newpost = response.data
        })   
        
        await this.getPosts()
        //this.disabled=true;
         /* const response = await fetch(`${baseUrl}/api/like/${post.id}`, {
          method: 'put',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.like)
        })  */
    }
    } catch(error){
      console.log(error)
  
    }  
},

getLikes: async function() {
  try {
    if (this.user.id && this.token){
      const response = await fetch(`${baseUrl}/api/like`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      })
      this.likes = await response.json()
  }
  } catch(error){
    console.log(error)

  }  
  
},

createLike: async function(e){
  try {
    this.addLike.id = e.id
    this.addLike.likes = 0
    if (this.user.id && this.token){
      const response = await fetch(`${baseUrl}/api/like`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(this.addLike)
      })

      newlike = await response.json()
      this.likes.push(newlike)
  }
  } catch(error){
    console.log(error)

  }  
},

    logout: async function () {
      this.token = ''
      this.user = {}
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      this.loginForm = {
        email: '',
        password: ''
      }

    }

  }
})

app.mount('#app')