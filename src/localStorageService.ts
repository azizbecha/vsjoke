'use strict';

import { Memento } from "vscode";

export class LocalStorageService {
    
    constructor(private storage: Memento) { }   
    
    public getValue(key : string){
        // default value is empty string
        return this.storage.get(key, "");
    }

    public setValue<T>(key : string, value : T){
        this.storage.update(key, value);
    }
}