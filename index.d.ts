interface Options {
   host: string,
   search?: string,
   timeout?: number,
   limit?: number
}
declare function portscan(options: Options): Promise<object>;
export = portscan;
