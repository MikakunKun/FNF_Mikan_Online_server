import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { Player } from "./schema/Player";
import { IncomingMessage } from "http";
import { ServerError } from "colyseus";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class GameRoom extends Room<RoomState> {
  maxClients = 2;
  LOBBY_CHANNEL = "$lobbiesChannel"
  IPS_CHANNEL = "$IPSChannel"
  chartHash:string = null;
  ownerIP:string = null;
  lastPingTime:number = null;

  async onCreate (options: any) {
    this.roomId = await this.generateRoomId();
    this.setPrivate();
    this.setState(new RoomState());
    this.autoDispose = true;

    this.setMetadata({name: options.name});

    this.onMessage("togglePrivate", (client, message) => {
      if (this.hasPerms(client)) {
        this.state.isPrivate = !this.state.isPrivate;
        this.setPrivate(this.state.isPrivate);
      }
    });

    this.onMessage("startGame", (client, message) => {
      if (this.clients.length >= 2 && this.hasPerms(client) && this.state.player1.hasSong && this.state.player2.hasSong) {
        this.state.isStarted = true;
        
        this.state.player1.score = 0;
        this.state.player1.misses = 0;
        this.state.player1.sicks = 0;
        this.state.player1.goods = 0;
        this.state.player1.bads = 0;
        this.state.player1.shits = 0;
        this.state.player1.hasLoaded = false;
        this.state.player1.hasEnded = false;

        this.state.player2.score = 0;
        this.state.player2.misses = 0;
        this.state.player2.sicks = 0;
        this.state.player2.goods = 0;
        this.state.player2.bads = 0;
        this.state.player2.shits = 0;
        this.state.player2.hasLoaded = false;
        this.state.player2.hasEnded = false;

        this.state.health = 1;

        this.broadcast("gameStarted", "", { afterNextPatch: true });
      }
    });

    this.onMessage("addScore", (client, message) => {
      if (this.state.isStarted) {
        this.getStatePlayer(client).score += message;
      }
    });

    this.onMessage("addMiss", (client, message) => {
      if (this.state.isStarted) {
        this.getStatePlayer(client).misses += 1;
      }
    });

    this.onMessage("addHitJudge", (client, message) => {
      if (this.state.isStarted) {
        switch (message) {
          case "sick":
            this.getStatePlayer(client).sicks += 1;
            break; // java war flashbacks
          case "good":
            this.getStatePlayer(client).goods += 1;
            break;
          case "bad":
            this.getStatePlayer(client).bads += 1;
            break;
          case "shit":
            this.getStatePlayer(client).shits += 1;
            break;
        }
      }
    });

    this.onMessage("setFSD", (client, message) => {
      if (this.hasPerms(client)) {
        this.state.folder = message[0];
        this.state.song = message[1];
        this.state.diff = message[2];
        this.chartHash = message[3];
        this.state.modDir = message[4];

        this.state.player1.hasSong = this.isOwner(client);
        if (this.state.player2 != null) {
          this.state.player2.hasSong = !this.isOwner(client);
        }

        this.broadcast("checkChart", "", {afterNextPatch: true});
      }
    });

    this.onMessage("verifyChart", (client, message) => {
      if (!this.isOwner(client)) {
        this.state.player2.hasSong = this.chartHash == message;
      }
      else {
        this.state.player1.hasSong = this.chartHash == message;
      }
    });

    this.onMessage("strumPlay", (client, message) => {
      if (this.clients[0] == null || this.clients[1] == null) {
        return;
      }

      this.broadcast("strumPlay", message, { except: client });
    });

    this.onMessage("charPlay", (client, message) => {
      if (this.clients[0] == null || this.clients[1] == null) {
        return;
      }

      this.broadcast("charPlay", message, { except: client });
    });

    this.onMessage("playerReady", (client, message) => {
      if (this.isOwner(client)) {
        this.state.player1.hasLoaded = true;
      }
      else {
        this.state.player2.hasLoaded = true;
      }

      if (this.state.player1.hasLoaded && this.state.player2.hasLoaded) {
        this.broadcast("startSong", "", { afterNextPatch: true });
      }
    });

    this.onMessage("playerEnded", (client, message) => {
      if (this.isOwner(client)) {
        this.state.player1.hasEnded = true;
      }
      else {
        this.state.player2.hasEnded = true;
      }

      if (this.state.player1.hasEnded && this.state.player2.hasEnded) {
        this.broadcast("endSong", "", { afterNextPatch: true });
      }
    });

    this.onMessage("noteHit", (client, message) => {
      if (this.clients[0] == null || this.clients[1] == null) {
        return;
      }

      this.broadcast("noteHit", message, { except: client });

      if (this.playerSide(client)) {
        this.state.health -= 0.023;
      }
      else {
        this.state.health += 0.023;
      }
      
      if (this.state.health > 2)
        this.state.health = 2;
      else if (this.state.health < 0)
        this.state.health = 0;
    });

    this.onMessage("noteMiss", (client, message) => {
      if (this.clients[0] == null || this.clients[1] == null) {
        return;
      }

      this.broadcast("noteMiss", message, { except: client });

      if (this.playerSide(client)) {
        this.state.health += 0.0475;
      }
      else {
        this.state.health -= 0.0475;
      }

      if (this.state.health > 2)
        this.state.health = 2;
      else if (this.state.health < 0)
        this.state.health = 0;
    });

    this.onMessage("chat", (client, message) => {
      if (message.length >= 300) {
        client.send("log", "The message is too long!");
      }
      this.broadcast("log", "<" + this.getStatePlayer(client).name + ">: " + message);
    });

    this.onMessage("swapSides", (client, message) => {
      if (this.hasPerms(client) || this.state.anarchyMode) {
        this.state.swagSides = !this.state.swagSides;
      }
    });

    this.onMessage("anarchyMode", (client, message) => {
      if (this.hasPerms(client)) {
        this.state.anarchyMode = !this.state.anarchyMode;
      }
    });

    this.onMessage("pong", (client, message:number) => {
      const daPing = Date.now() - this.lastPingTime;

      if (this.isOwner(client)) {
        this.metadata.ping = daPing;
        this.state.player1.ping = daPing;
      }
      else {
        this.state.player2.ping = daPing;
      }
    });

    this.onMessage("hey", (client, message) => {
      
    });

    this.onMessage("requestEndSong", (client, message) => {
      if (this.hasPerms(client)) {
        this.broadcast("endSong", "", { afterNextPatch: true });
      }
      else {
        this.broadcast("log", this.getStatePlayer(client).name + " wants to end the song! (ESC)");
      }
    });

    this.clock.setInterval(() => {
      this.lastPingTime = Date.now();
      this.broadcast("ping");
    }, 3000);
  }

  async onAuth(client: Client, options: any, request?: IncomingMessage) {
    if (this.clients.length == 0) {
      if (await this.canClientCreate(request)) {
        this.ownerIP = request.socket.remoteAddress;
      }
      else {
        throw new ServerError(5002, "Can't create 3 servers on the same IP! Try again in a moment."); 
      }
    }
    const latestVersion = await this.latestVersion();
    if (options == null || options.name == null || (options.name + "").trim().length < 3) {
      throw new ServerError(5000, "Too short name!"); // too short name error
    }
    else if (latestVersion != options.version) {
      throw new ServerError(5003, "Outdated client, please update!\nYour version: " + options.version + " latest: " + latestVersion);
    }
    else if (options.name.length >= 20) {
      throw new ServerError(5001, "Too long name!"); 
    }
    return true;
  }

  async latestVersion():Promise<String> {
    let res = await fetch('https://raw.githubusercontent.com/MikakunKun/FNF_Mikan_Online_client/main/gitVersion.txt');
    let data = await res.text();
    return (data + "").split('\n')[0].trim(); 
  }

  onJoin (client: Client, options: any) {
    if (this.clients.length == 1) {
      this.state.player1 = new Player();
      this.state.player1.name = options.name;
    }
    else if (this.clients.length == 2) {
      this.state.player2 = new Player();
      if (this.state.player1.name == options.name) {
        options.name += "(2)";
      }
      this.state.player2.name = options.name;
    }
    // else if (this.clients.length == 3) {
    //   this.state.player3 = new Player();
    //   if (this.state.player2.name == options.name || this.state.player1.name == options.name) {
    //     options.name += "(2)";
    //   }
    //   this.state.player3.name = options.name;
    // }

    this.broadcast("log", this.getStatePlayer(client).name + " has joined the room!", { afterNextPatch: true });

    client.send("checkChart", "", { afterNextPatch: true });

    this.clock.setTimeout(() => {
      if (client != null)
        client.send("checkChart", "", { afterNextPatch: true });
    }, 1000);
  }

  onLeave (client: Client, consented: boolean) {
    this.broadcast("log", this.getStatePlayer(client).name + " has left the room!");

    this.broadcast("endSong");

    if (this.isOwner(client)) {
      this.disconnect(4000);
    }
    else {
      this.state.player2 = new Player();
    }

    // try {
    //   if (consented) {
    //     throw new Error("consented");
    //   }
    //   await this.allowReconnection(client, 3); 
    //   this.broadcast("log", (this.isOwner(client) ? this.state.player1.name : this.state.player2.name) + " has reconnected to the room!");
    // }
    // catch (err) {
    //   //player actually lefts
    // }
  }

  async onDispose() {
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    //this.presence.hset(this.IPS_CHANNEL, this.ownerIP, ((Number.parseInt(await this.presence.hget(this.IPS_CHANNEL, this.ownerIP)) - 1) + ""));
  }

  hasPerms(client: Client) {
    return this.isOwner(client) || this.state.anarchyMode;
  }

  isOwner(client: Client) {
    return this.clients.indexOf(client) == 0;
  }

  playerSide(client: Client) {
    return this.state.swagSides ? !this.isOwner(client) : this.isOwner(client);
  }

  isGf(client:Client) {
    return this.clients.indexOf(client) >= 2;
  }

  getStatePlayer(client:Client):Player {
    if (this.isGf(client)) {
      return null;
      //return this.state.player3;
    }

    return (this.isOwner(client) ? this.state.player1 : this.state.player2);
  }

  // Generate a single 4 capital letter room ID.
  generateRoomIdSingle(): string {
    let result = '';
    for (var i = 0; i < 4; i++) {
      result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }
    return result;
  }

  // 1. Get room IDs already registered with the Presence API.
  // 2. Generate room IDs until you generate one that is not already used.
  // 3. Register the new room ID with the Presence API.
  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id;
    do {
      id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }

  async canClientCreate(request: IncomingMessage): Promise<Boolean> {
    return true;
    // if (this.clients.length > 0) {
    //   return true;
    // }
    // const currentIps = await this.presence.hget(this.IPS_CHANNEL, request.socket.remoteAddress);
    // var ipOccurs = currentIps == null ? 0 : Number.parseInt(currentIps);
    // if (ipOccurs < 2) {
    //   await this.presence.hset(this.IPS_CHANNEL, request.socket.remoteAddress, (ipOccurs + 1) + "");
    //   return true;
    // }
    // return false;
  }
}