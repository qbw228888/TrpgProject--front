import Vue from "vue";
import Router from "vue-router";
import Welcome from "../components/Welcome";
import main from "../components/main";
import roomList from "../components/roomList";
import createRoom from "../components/createRoom";
import {Message} from "element-ui";
import userDetail from "../components/userDetail";
import user from "../components/user";
import myRoom from "../components/myRoom";
import myJoin from "../components/myJoin";
import myCreate from "../components/myCreate";
import systemMessage from "../components/systemMessage";
import room from "@/components/room";
import roomDetailForOwner from "@/components/roomDetailForOwner";

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: userDetail,
      children: [
        {
          path: "/user",
          name: "user",
          component: user,
          meta: {
            title: "用户信息"
          }
        },
        {
          path: "/systemMessage",
          name: "systemMessage",
          component: systemMessage,
          meta: {
            title: "系统消息"
          }
        },
        {
          path: "/myRoom",
          name: "myRoom",
          component: myRoom,
          meta: {
            title: "我的房间"
          },
          children: [
            {
              path: "/myJoin",
              name: "myJoin",
              component: myJoin,
              meta: {
                title: "我加入的"
              }
            },
            {
              path: "/myCreate",
              name: "myCreate",
              component: myCreate,
              meta: {
                title: "我创建的"
              }
            }
          ]
        }
      ]
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      redirect: {name: 'roomList'},
      children: [
        {
          path: "/roomList",
          name: "roomList",
          component: roomList,
          meta: {
            title: "房间列表"
          }
        },
        {
          path: "/create",
          name: "createRoom",
          component: createRoom,
          meta: {
            title: "创建房间"
          }
        }
      ]
    },
    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/roomDetailForOwner',
      name: 'roomDetailForOwner',
      component: roomDetailForOwner
    },
  ]
})
export default router

// 挂载路由前置导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 表示从哪个路径跳转过来
  // next 是一个函数，表示放行
  if (to.path === '/') return next() // 如果访问的是登录页则直接放行，否则需要强制登录
  // 获取token
  const token = window.sessionStorage.getItem('token')
  console.log(token)
  if (!token) {
    Message({
      message: "请登录",
      type: "error"
    })
    return next('/')// 如果获取的不是token，则强制登录，否则放行
  }
  next()
})
