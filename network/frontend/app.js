const baseUrl = 'http://127.0.0.1:8000'
const app = Vue.createApp({
  data: function () {
    return {
      title: 'Network',
      token: '',
      user: {},
      posts: [],
      file:null,
      showNewPost: false,
      showEditPost: false,
      loginForm: {
        email: '',
        password: ''
      },
      postForm: {
        title: '',
        content: '',
        //image: ''
      },
      editForm: {
        id: '',
        title: '',
        content: '',
        image: ''
      }
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
        }

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
      const json = newpost
      //console.log(newpost)
      this.posts.push(json)
      this.showNewPost = false
/*          const response=await fetch(`${baseUrl}/api/user/${this.user.id}/posts`, {
          method: 'post',
          headers: {
            'Content-Type':'multipart/form-data',
            'Authorization': `Bearer ${this.token}`
          },
          body: formData
        });


        const json = await response.json()
        //console.log(json)
        this.posts.push(json)
        this.showNewPost = false */
        
      }catch(error){
        console.log(error)
      }  
    },


    editPost: function (post) {
      this.editForm.title = post.title
      this.editForm.content = post.content
      this.editForm.id = post.id
    },
    updatePost: async function (e) {
      try{
        e.preventDefault()
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
      this.getPosts()
        
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
    logout: async function () {
      
    }

  }
})

app.mount('#app')