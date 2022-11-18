// websocket的域名和端口号的配置
const BASE_URL = 'localhost';
const WS_PORT = '9001';
//当然，这里的id应该是用户的id或者唯一标识等，由于我没有做登录的块，所以直接加上了'/id'本质上应该是在调用socket的时候拼接参数给后端的

export const useWebSocket = (handleMessage, uid, rid) => {
    const WS_ADDRESS = `ws://${BASE_URL}:${WS_PORT}/websocket/${uid}/${rid}`;
    const ws = new WebSocket(WS_ADDRESS );

    //ws.binaryType = 'arraybuffer'; //可将 WebSocket 对象的 binaryType 属性设为“blob”或“arraybuffer”。默认格式为“blob”（您不必在发送时校正 binaryType 参数）。
    const init = () => {
        ws.addEventListener('open', handleOpen, false);
        ws.addEventListener('close', handleClose, false);
        ws.addEventListener('error', handleError, false);
        //消息处理方法，本处是以构造参数传入的方式更为灵活的处理消息
        ws.addEventListener('message', handleMessage, false);
    };
    //连接建立时会调用的方法
    function handleOpen(e) {
        console.log('WebSocket open', e);
    }
    //连接关闭时会调用的方法
    function handleClose(e) {
        console.log('WebSocket close', e);
    }
    //连接出现异常时需要调用的方法
    function handleError(e) {
        console.log('WebSocket error', e);
    }

    init();
    return ws;
};