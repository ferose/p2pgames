export default function webWorkerEnabler(worker: any) {
    let code = worker.toString();
    code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

    const blob = new Blob([code], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
}