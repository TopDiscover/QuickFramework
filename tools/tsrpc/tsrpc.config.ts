import { TsrpcConfig } from 'tsrpc-cli';

const tsrpcConf: TsrpcConfig = {
    // Sync shared code , 同步连接bundles
    sync: [
        {
            from: '../../bundles/bundles',
            to: '../../proj/assets/bundles',
            type: 'symlink'     // Change this to 'copy' if your environment not support symlink
        }
    ],
}
export default tsrpcConf;