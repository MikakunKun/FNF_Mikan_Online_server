"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.score = 0;
        this.misses = 0;
        this.sicks = 0;
        this.goods = 0;
        this.bads = 0;
        this.shits = 0;
        this.name = "";
        this.hasSong = false;
        this.hasLoaded = false;
        this.hasEnded = false;
        this.ping = 0;
    }
}
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "score", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "misses", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "sicks", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "goods", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "bads", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "shits", void 0);
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Player.prototype, "hasSong", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Player.prototype, "hasLoaded", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Player.prototype, "hasEnded", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "ping", void 0);
exports.Player = Player;
