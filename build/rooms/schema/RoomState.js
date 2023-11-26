"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomState = void 0;
const schema_1 = require("@colyseus/schema");
const Player_1 = require("./Player");
class RoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.song = "none";
        this.folder = "";
        this.diff = 1;
        this.modDir = "";
        this.isPrivate = true;
        this.isStarted = false;
        this.swagSides = false;
        this.anarchyMode = false;
        this.health = 0.0;
    }
}
__decorate([
    (0, schema_1.type)("string")
], RoomState.prototype, "song", void 0);
__decorate([
    (0, schema_1.type)("string")
], RoomState.prototype, "folder", void 0);
__decorate([
    (0, schema_1.type)("number")
], RoomState.prototype, "diff", void 0);
__decorate([
    (0, schema_1.type)("string")
], RoomState.prototype, "modDir", void 0);
__decorate([
    (0, schema_1.type)(Player_1.Player)
], RoomState.prototype, "player1", void 0);
__decorate([
    (0, schema_1.type)(Player_1.Player)
], RoomState.prototype, "player2", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], RoomState.prototype, "isPrivate", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], RoomState.prototype, "isStarted", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], RoomState.prototype, "swagSides", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], RoomState.prototype, "anarchyMode", void 0);
__decorate([
    (0, schema_1.type)("number")
], RoomState.prototype, "health", void 0);
exports.RoomState = RoomState;
