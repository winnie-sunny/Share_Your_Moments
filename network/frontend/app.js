const baseUrl = 'http://127.0.0.1:8000'

const app = Vue.createApp({
  data: function () {
    return {
      title: 'Network',
      token: '',
      user: {},
      posts: [],
      showNewPost: false,
      showEditPost: false,
      loginForm: {
        email: '',
        password: ''
      },
      postForm: {
        title: '',
        content: '',
        image: ''
      },
      editForm: {
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
    addPost: async function () {
/*        try{
        const response=await fetch(`${baseUrl}/api/user/${this.user.id}/posts`,{
          method: 'post',
          headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.postForm)
        })

        const json = await response.json()
        this.posts.push(json)
        this.showNewPost = false
        
      }catch(error){
        console.log(error)
      }  */
    },
    editPost: function (post) {
      
    },
    updatePost: async function () {

    },
    deletePost: async function (post) {
      
    },
    logout: async function () {
      
    }

  }
})

app.mount('#app')