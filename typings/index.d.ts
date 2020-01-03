declare module "*.module.scss";

declare module "*.worker.ts" {
    class WebpackWorker extends Worker {
      constructor();
    }

    export default WebpackWorker;
}
