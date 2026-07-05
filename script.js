// I spent SO LONG making all of this.

// Read Save Data
// Save data must be imported and will be a JSON

// Hard coding all text data because it's the most practical way to go
let WeaponText = [
    "Empty Slot", "",
    "Standard Sword","The standard sword of Edutopia",
    "Flame Blade","A sword infused with fire",
    "Lightning Blade","A sword infused with lightning",
    "Ice Blade","A sword infused with ice",
    "Heavy Sword","A very heavy sword offering high damage\nbut requiring incredible accuracy",
    "The Sword of Light","A sword of divine origins that heals the user\nby a small amount upon a successful attack",
    "The Sword of Darkness","A very powerful sword that drains life\nenergy upon unsuccessful attacks",
    "Short Sword","A short sword allowing for faster\nstrikes",
    "Spear","The standard spear of Edutopia",
    "Boiling Point","A spear infused with fire",
    "Thundering Spear","A spear infused with lightning",
    "Snow Tip","A spear infused with ice",
    "Ice Rod","Used by the best ice mages of Edutopia",
    "Fire Rod","Used by the best fire mages of Edutopia",
    "Lightning Rod","Used by the best lightning mages of Edutopia",
    "Utility Rod","Used by the best utility mages of Edutopia"
];

/* For Easy Rebalancing
 Damage, Magic, Accuracy(Chance to hit even when wrong), Bonus Ability
 Ability List:
 0:None
 1:Fire
 2:Lightning
 3:Ice
 4:Light
 5:Dark
 6:FireBoost
 7:IceBoost
 8:LightningBoost
 9:UtilityBoost
*/
let WeaponsStats = [
                    [1,1,0,0],
                    [5,1,10,0],
                    [2,2,8,1],
                    [2,2,8,2],
                    [2,2,8,3],
                    [8,1,2,0],
                    [2,3,12,4],
                    [12,0,0,5],
                    [2,1,20,0],
                    [6,1,4,0],
                    [3,2,4,1],
                    [3,2,4,2],
                    [3,2,4,3],
                    [0,6,5,6],
                    [0,6,5,7],
                    [0,6,5,8],
                    [0,6,5,9]
];

// Setting Up The Game Canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Loading Images
const TabsImage = new Image();
TabsImage.src = './assets/Icons.png';

const WeaponsImage = new Image();
WeaponsImage.src = './assets/MathWeapons.png';

const StatsImage = new Image();
StatsImage.src = './assets/Stats.png';

// Loading Fonts
// The browser looks up "BlockyFont" from your CSS file
document.fonts.load('16px "BlockyFont"');

let SelectedTextBox = -1;
let TextBoxes = [];
let mousex = 0;
let mousey = 0;
let RelMouseX = 0;
let RelMouseY = 0;
let Keys = [false,false,false,false];
let KeyDelay = [0,0,0,0];
let playerx = 0;
let playery = 0;
let QueueN = 0;

// 0 is Map
// 1 is Fight
// 2 is Math Question
// 3 is Inventory
// 4 is Dialogue
let Screen = 0;
let Menu = 0;

// 0 is attack 1-4 is spells, 5 is flee, items never ask question and can never fail, Magic when failed has a 65% damage decrease and if it's a positive buff it has a 30% chance of failing with healing getting a 65% reduced effectiveness instead of chance of failing.
let SelectedAction = 0;

class Animation
{
    constructor(Type, Target, Queue, Damage)
    {
        this.Type = Type;
        this.Target = Target;
        this.Queue = Queue;
        this.AnimFrame = 0;
        this.Damage = Damage;
        this.DamageDealt = 0;
        this.Initialize();
    }
    Initialize()
    {
        switch(this.Type)
        {
            case 0:
                // Default Attack (Sword)
                this.AnimFrame = 30;
                break;
            case 1:
                // Fire
                this.AnimFrame = 30;
                break;
            case 2:
                // Lightning
                this.AnimFrame = 30;
                break;
            case 3:
                // Ice
                this.AnimFrame = 30;
                break;
            case 4:
                // Light
                this.AnimFrame = 30;
                break;
            case 5:
                // Dark
                this.AnimFrame = 30;
                break;
            case 6:
                // Heal
                this.AnimFrame = 30;
                break;
            default:
                console.log("Animation Type: "+this.Type.toString()+" Does not exist. If you are a user please report this to the developer. (Initialization Phase)");
        }
    }
    Render()
    {
        this.AnimFrame -= 1;
        ctx.font = '20px "BlockyFont"';
        ctx.textAlign = "center";
        // Heal
        if(this.Type == 6)
        {
            ctx.fillStyle = "#30B550";
            // Player
            if(this.Target == 0)
            {
                if(this.Damage > 0)
                {
                    if(((30-this.AnimFrame)*(this.Damage/30))-this.DamageDealt>=1)
                    {
                        PlayerHp += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                        this.DamageDealt += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                    }
                    if(this.AnimFrame == 0)
                    {
                        PlayerHp += (this.Damage - this.DamageDealt);
                    }
                    ctx.fillText("+"+this.Damage.toString(),150,200-(30-this.AnimFrame)*2);
                }
                else
                {
                    ctx.fillText("Miss",150,200-(30-this.AnimFrame)*2);
                }
            }
            // Enemy
            else
            {
                if(this.Damage > 0)
                {
                    if(((30-this.AnimFrame)*(this.Damage/30))-this.DamageDealt>=1)
                    {
                        EnemyHp += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                        this.DamageDealt += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                    }
                    if(this.AnimFrame == 0)
                    {
                        EnemyHp += (this.Damage - this.DamageDealt);
                    }
                    ctx.fillText("+"+this.Damage.toString(),650,200-(30-this.AnimFrame)*2);
                }
                else
                {
                    ctx.fillText("Miss",650,200-(30-this.AnimFrame)*2);
                }
            }
        }
        else
        {
            if(this.Type == 0)
            {
                ctx.fillStyle = "#EEEEEE";
            }
            else if(this.Type == 1)
            {
                ctx.fillStyle = "#FF9933";
            }
            else if(this.Type == 2)
            {
                ctx.fillStyle = "#EEEE44";
            }
            else if(this.Type == 3)
            {
                ctx.fillStyle = "#AABBFF";
            }
            // Player
            if(this.Target == 0)
            {
                if(((30-this.AnimFrame)*(this.Damage/30))-this.DamageDealt>=1)
                {
                    PlayerHp -= Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                    this.DamageDealt += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                }
                if(this.AnimFrame == 0)
                {
                    PlayerHp -= (this.Damage - this.DamageDealt);
                }
                if(this.Damage > 0)
                {
                    ctx.fillText("-"+this.Damage.toString(),150,200-(30-this.AnimFrame)*2);
                }
                else
                {
                    ctx.fillText("Miss",150,200-(30-this.AnimFrame)*2);
                }
            }
            // Enemy
            else
            {
                if(((30-this.AnimFrame)*(this.Damage/30))-this.DamageDealt>=1)
                {
                    EnemyHp -= Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                    this.DamageDealt += Math.floor(((30-this.AnimFrame)*(this.Damage))/30-this.DamageDealt);
                }
                if(this.AnimFrame == 0)
                {
                    EnemyHp -= (this.Damage - this.DamageDealt);
                }
                if(this.Damage > 0)
                {
                    ctx.fillText("-"+this.Damage.toString(),650,200-(30-this.AnimFrame)*2);
                }
                else
                {
                    ctx.fillText("Miss",650,200-(30-this.AnimFrame)*2);
                }
            }
        }
        switch(this.Type)
        {
            case 0:
                if(this.Target == 1)
                {
                    ctx.drawImage(WeaponsImage, 32*((Equipment[0]-1)%4),32*Math.floor((Equipment[0]-1)/4),32,32,170,200,32,32);
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
        }
    }
    MatchingQueue()
    {
        return this.Queue == QueueN;
    }
    Complete()
    {
        return this.AnimFrame<=0;
    }
}

let Animations = [];

// Heart beat
let PAF = [0]; // Player Animation Frames

// Heart beat
let EAF = [15]; // Enemy Animation Frames

// Player in Battle Stats
let PlayerHp = 20;
let PlayerMhp = 80;
let PlayerMp = 14;
let PlayerMmp = 24;
let PlayerAtk = 100;
let PlayerDef = 4;
let PlayerMagic = 4;
let PlayerAccuracy = 100;
let PlayerName = "Player";
// Weapon, Armor, Accessory 1, Accessory 2, Accessory 3
let Equipment = [1,0,0,0,0];
// Weapon, Armor, Accessories, Items, Key Items
let Inventory = [[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,0],[],[],[],[]];
// -1 is nothing, 0 is currentEquiped, >0 is inventory
let SelectedInventorySlot = -1;
let Accurate = true;

/*
 0: Fire
 1: Ice
 2: Lightning
 3: Revitalize
 4: Protect
 */
let Spells = ["Fire","Protect","Half-Life","Revitalize"];

// Other stuff
let InvTab = 0;

// Enemy in Battle Stats
let EnemyHp = 12;
let EnemyMhp = 12;
let EnemyAtk = 2;
let EnemyDef = 2;
let EnemyMDef = 1;

let Enemies = [];

// Questions
let CurrentQuestion = "1 + 1 =";
let Answer = ["2"];

class Enemy
{
    // Type, x, y, CurrentWayPoint
    constructor(type,x,y,cwp)
    {
        this.type = type;
        this.x = x;
        this.y = y;
        this.cwp = cwp;
    }
    FindNextWP()
    {
        
    }
    Render()
    {
        ctx.fillStyle = "#FF0088";
        ctx.fillRect(this.x,this.y,20,20);
    }
    Collision()
    {
        
    }
    Move()
    {
        let speed = 5;
        // REPLACE WITH WAY POINTS-ISH
        if(playerx<this.x)
        {
            this.x = Math.max(playerx,this.x-speed);
        }
        else if(playerx>this.x)
        {
            this.x = Math.min(playerx,this.x+speed);
        }
        if(playery<this.y)
        {
            this.y = Math.max(playery,this.y-speed);
        }
        else if(playery>this.y)
        {
            this.y = Math.min(playery,this.y+speed);
        }
    }
}


// Calculate Player Stats
function CalcPS()
{
    // Set Base Stats
    PlayerMhp = 20;
    PlayerMmp = 12;
    PlayerAtk = 1;
    PlayerDef = 1;
    PlayerMagic = 1;
    // Weapon
    if(Equipment[0] > 0)
    {
        PlayerAtk += WeaponsStats[Equipment[0]][0];
        PlayerMagic += WeaponsStats[Equipment[0]][1];
        PlayerAccuracy = WeaponsStats[Equipment[0]][2];
    }
    
    if(PlayerHp>PlayerMhp)
    {
        PlayerHp = PlayerMhp;
    }
    if(PlayerMp>PlayerMmp)
    {
        PlayerMp = PlayerMmp;
    }
}

// Hard Coding Every Single Enemy o7
function LoadBattle(Type)
{
    CalcPS();
    if(Type == 0)
    {
        EnemyHp = 24;
        EnemyMhp = 24;
        EnemyAtk = 1;
        EnemyDef = 0;
        EnemyMDef = 0;
    }
    Animations = [];
    Screen = 1;
}

class Chunk
{
    constructor(x,y,color)
    {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    Render()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,800,450);
    }
}

let LoadedChunks = [];
LoadedChunks.push(new Chunk(-800,-450,"#802020"));
LoadedChunks.push(new Chunk(0,-450,"#884411"));
LoadedChunks.push(new Chunk(800,-450,"#888820"));
LoadedChunks.push(new Chunk(-800,0,"#208820"));
LoadedChunks.push(new Chunk(0,0,"#202066"));
LoadedChunks.push(new Chunk(800,0,"#762076"));
LoadedChunks.push(new Chunk(-800,450,"#FFFFFF"));
LoadedChunks.push(new Chunk(0,450,"#808080"));
LoadedChunks.push(new Chunk(800,450,"#222222"));

class TextBox
{
    constructor(text, x, y, color, OnlyNumbers, defaultText, type)
    {
        this.cursor = 0;// This doesn't work yet and is also a future me problem =D
        this.color = color;
        this.text = text;
        this.x = x;
        this.y = y;
        this.OnlyNumbers = OnlyNumbers;
        this.by = 20;
        this.bx = 80;
        this.defaultText = defaultText;
        this.type = type
    }
    Render()
    {
        if(this.type == 0)
        {
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(this.x,this.y,this.bx,this.by);
            ctx.textAlign = "left";
            ctx.fillStyle = this.color;
            if(this.text != "")
            {
                ctx.fillText(this.text,this.x,this.y+this.by-5);
            }
            else
            {
                ctx.fillText(this.defaultText,this.x,this.y+this.by-5);
            }
        }
        else if(this.type == 1)
        {
            ctx.fillStyle = "#EEEEEE";
            ctx.fillRect(this.x-this.bx*0.5,this.y,this.bx,this.by);
            ctx.textAlign = "center";
            ctx.fillStyle = this.color;
            if(this.text != "")
            {
                ctx.fillText(this.text,this.x,this.y+this.by-5);
            }
            else
            {
                ctx.fillText(this.defaultText,this.x,this.y+this.by-5);
            }
        }
    }
    // Checks if clicked on
    CheckMouse()
    {
        if(this.type == 0)
        {
            return RelMouseX>this.x && RelMouseX<this.x+this.bx && RelMouseY>this.y && RelMouseY<this.y+this.by;
        }
        else if(this.type == 1)
        {
            return RelMouseX>this.x-this.bx*0.5 && RelMouseX<this.x+this.bx*0.5 && RelMouseY>this.y && RelMouseY<this.y+this.by;
        }
    }
    Update(key,keyCode)
    {
        
        // Back of the Space
        if(keyCode == 8)
        {
            let newtext = "";
            if(this.text.length>0)
            {
                for(let c=0;c<this.text.length-1;c++)
                {
                    newtext += this.text.charAt(c);
                }
            }
            this.text = newtext;
        }
        
        // Enter
        else if(keyCode == 13)
        {
            SelectedTextBox = -1;
        }
        
        else
        {
            //DO NOT DO THIS IF I ONLY WANT NUMBERS!
            if(!this.OnlyNumbers)
            {
                if(keyCode == 32 || keyCode>=65 && keyCode<=90 || keyCode>=48 && keyCode<=57 || keyCode>186)
                {
                    this.text+=key;
                }
            }
            // Nothing but Numbers =D
            else
            {
                // 0-9
                if(keyCode>=48 && keyCode<=57)
                {
                    this.text+=key;
                }
            }
        }
    }
}

function drawMultiLineText(text, x, y, lineHeight) {
    // Split the text string wherever there is a \n
    const lines = text.split('\n');
    
    // Loop through each line and draw it lower than the last
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * lineHeight));
    }
}

function fullscreencanvas()
{
    // Goal is to maintain a 16 by 9 ratio
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    // Width is too big
    if(w/16 > h/9)
    {
        w = 16*(h/9);
    }
    
    //Height is too big, or perfect ratio
    else
    {
        h = 9*(w/16);
    }
    
    canvas.width  = 800//Math.floor(w);
    canvas.height = 450//Math.floor(h);
    canvas.style.width  = Math.floor(w) + "px";
    canvas.style.height = Math.floor(h) + "px";
    CanvasW = Math.floor(w);
    CanvasH = Math.floor(h);
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false; // For older Safari/Chrome
    ctx.mozImageSmoothingEnabled = false;    // For older Firefox
}

function update()
{
    if(Screen == 0)
    {
        // Movement
        if(Keys[0])
        {
            playery -= 5;
        }
        if(Keys[1])
        {
            playerx -= 5;
        }
        if(Keys[2])
        {
            playery += 5;
        }
        if(Keys[3])
        {
            playerx += 5;
        }
        
        // Chunk Loading
        for(let c=0;c<9;c++)
        {
            if(playerx > LoadedChunks[c].x+800)
            {
                LoadedChunks[c].x += 2400;
            }
            if(playerx+800 < LoadedChunks[c].x)
            {
                LoadedChunks[c].x -= 2400;
            }
            if(playery > LoadedChunks[c].y+450)
            {
                LoadedChunks[c].y += 1350;
            }
            if(playery+450 < LoadedChunks[c].y)
            {
                LoadedChunks[c].y -= 1350;
            }
        }
    }
}

function DisplayQuestion(x,y,color)
{
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(CurrentQuestion,x,y);
}

function render()
{
    if(Screen == 0 || Screen == 3)
    {
        ctx.save()
        ctx.translate(-playerx,-playery);
        
        for(let c = 0;c<9;c++)
        {
            LoadedChunks[c].Render()
        }
        
        ctx.fillStyle = "#2020FF";
        ctx.fillRect(playerx+392,playery+217,16,16);
        ctx.restore();
        
        
    }
    else if(Screen == 1)
    {
        ctx.fillStyle = "#080836";
        ctx.fillRect(0,0,800,450);
        // Player
        ctx.fillStyle = "#2020FF";
        ctx.fillRect(130,193,40,64);
        
        // Hp
        ctx.fillStyle = "#404040";
        for(let i=Math.floor(PlayerHp/4);i<Math.floor(PlayerMhp*0.25);i++)
        {
            ctx.drawImage(StatsImage,128,0,32,32,20+(i%10)*20,30+Math.floor(i/10)*20,16,16);
        }
        ctx.fillStyle = "#FF4040";
        for(let i=0;i<Math.floor((PlayerHp-1)/4);i++)
        {
            ctx.drawImage(StatsImage,0,0,32,32,20+(i%10)*20,30+Math.floor(i/10)*20,16,16);
            //ctx.fillRect(500+(i%10)*24,30+Math.floor(i/10)*24,16,16);
        }
        PAF[0] = (PAF[0]+1)%40;
        let Shift = Math.abs(PAF[0]-20)*0.125;
        switch(PlayerHp%4)
        {
            case 0:
                ctx.drawImage(StatsImage,0,0,32,32,20+(Math.floor((PlayerHp-1)/4)%10)*20,30+Math.floor(Math.floor((PlayerHp-1)/4)/10)*20,16,16);
                break;
            case 1:
                ctx.drawImage(StatsImage,96,0,32,32,20+(Math.floor((PlayerHp-1)/4)%10)*20,30+Math.floor(Math.floor((PlayerHp-1)/4)/10)*20,16,16);
                break;
            case 2:
                ctx.drawImage(StatsImage,64,0,32,32,20+(Math.floor((PlayerHp-1)/4)%10)*20,30+Math.floor(Math.floor((PlayerHp-1)/4)/10)*20,16,16);
                break;
            case 3:
                ctx.drawImage(StatsImage,32,0,32,32,20+(Math.floor((PlayerHp-1)/4)%10)*20,30+Math.floor(Math.floor((PlayerHp-1)/4)/10)*20,16,16);
                break;
        }
        
        // Mp
        ctx.fillStyle = "#404040";
        for(let i=Math.floor(PlayerMp/4);i<Math.floor(PlayerMmp*0.25);i++)
        {
            ctx.drawImage(StatsImage,128,32,32,32,20+i*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
        }
        ctx.fillStyle = "#4040FF";
        for(let i=0;i<Math.floor((PlayerMp)/4);i++)
        {
            ctx.drawImage(StatsImage,0,32,32,32,20+i*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
        }
        /*if(PlayerMp%4 > 0)
        {
            ctx.drawImage(StatsImage,(4-(PlayerMp%4))*32,32,32,32,,16,16);
        }*/
        switch(PlayerMp%4)
        {
            case 0:
                ctx.drawImage(StatsImage,0,32,32,32,20+Math.floor((PlayerMp-1)/4)*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
                break;
            case 1:
                ctx.drawImage(StatsImage,96,32,32,32,20+Math.floor((PlayerMp-1)/4)*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
                break;
            case 2:
                ctx.drawImage(StatsImage,64,32,32,32,20+Math.floor((PlayerMp-1)/4)*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
                break;
            case 3:
                ctx.drawImage(StatsImage,32,32,32,32,20+Math.floor((PlayerMp-1)/4)*20,50+Math.floor((PlayerMhp-1)/40)*24,16,16);
                break;
        }
        //let n = Math.floor((PlayerMp-1)/4);
        //ctx.fillRect(500+n*12,50+Math.floor((PlayerMhp-1)/40)*24+4*(4-PlayerMp%4),8,4*(PlayerMp%4));
        
        // Enemy
        ctx.fillStyle = "#FF2020";
        ctx.fillRect(630,193,40,64);
        
        ctx.fillStyle = "#404040";
        for(let i=Math.max(Math.floor(EnemyHp/4),0);i<Math.floor(EnemyMhp*0.25);i++)
        {
            ctx.drawImage(StatsImage,128,0,32,32,500+(i%10)*20,30+Math.floor(i/10)*20,16,16);
        }
        ctx.fillStyle = "#FF4040";
        for(let i=0;i<Math.floor((EnemyHp-1)/4);i++)
        {
            ctx.drawImage(StatsImage,0,0,32,32,500+(i%10)*20,30+Math.floor(i/10)*20,16,16);
            //ctx.fillRect(500+(i%10)*24,30+Math.floor(i/10)*24,16,16);
        }
        EAF[0] = (EAF[0]+1)%40;
        if(EnemyHp>0)
        {
            switch(EnemyHp%4)
            {
                case 0:
                    ctx.drawImage(StatsImage,0,0,32,32,500+(Math.floor((EnemyHp-1)/4)%10)*20,30+Math.floor(Math.floor((EnemyHp-1)/4)/10)*20,16,16);
                    break;
                case 1:
                    ctx.drawImage(StatsImage,96,0,32,32,500+(Math.floor((EnemyHp-1)/4)%10)*20,30+Math.floor(Math.floor((EnemyHp-1)/4)/10)*20,16,16);
                    break;
                case 2:
                    ctx.drawImage(StatsImage,64,0,32,32,500+(Math.floor((EnemyHp-1)/4)%10)*20,30+Math.floor(Math.floor((EnemyHp-1)/4)/10)*20,16,16);
                    break;
                case 3:
                    ctx.drawImage(StatsImage,32,0,32,32,500+(Math.floor((EnemyHp-1)/4)%10)*20,30+Math.floor(Math.floor((EnemyHp-1)/4)/10)*20,16,16);
                    break;
            }
        }
        
        ctx.fillStyle = "#EEEEEE";
        ctx.font = '20px "BlockyFont"';
        ctx.textAlign = "left";
        ctx.fillText("Enemy",500,20);
        
        ctx.fillText(PlayerName,20,20);
        
        for(let i=0;i<Animations.length;i++)
        {
            if(Animations[i].MatchingQueue())
            {
                Animations[i].Render();
                if(Animations[i].Complete())
                {
                    Animations.splice(i,1);
                    i--;
                    // Check For Queue Change
                    let NewQ = 50;
                    for(let j=0;j<Animations.length;j++)
                    {
                        if(Animations[j].Queue == QueueN)
                        {
                            NewQ = QueueN;
                            break;
                        }
                        if(Animations[j].Queue < NewQ)
                        {
                            NewQ = Animations[j].Queue;
                        }
                    }
                    if(NewQ == 50)
                    {
                        QueueN = 0;
                    }
                    else
                    {
                        QueueN = NewQ;
                    }
                    if(EnemyHp <= 0)
                    {
                        Screen = 0;
                        break;
                    }
                }
            }
        }
        
        if(Animations.length == 0)
        {
            ctx.fillStyle = "#202856";
            ctx.fillRect(250,250,300,200);
            ctx.fillStyle = "#CCCCCC";
            ctx.textAlign = "center";
            if(Menu == 0)
            {
                ctx.fillText("Attack",325,300);
                ctx.fillText("Magic",475,300);
                ctx.fillText("Item",325,400);
                ctx.fillText("Flee",475,400);
            }
            if(Menu == 1)
            {
                ctx.fillText(Spells[0],325,300);
                ctx.fillText(Spells[1],475,300);
                ctx.fillText(Spells[2],325,400);
                ctx.fillText(Spells[3],475,400);
            }
        }
    }
    else if(Screen == 2)
    {
        ctx.fillStyle = "#909090";
        ctx.fillRect(0,0,800,450);
        
        DisplayQuestion(400,50,"#000000");
        
        // Make sure all textfields are filled
        let TextFilled = true;
        for(let t=0;t<TextBoxes.length;t++)
        {
            if(TextBoxes[t].text == "")
            {
                TextFilled = false;
                break;
            }
        }
        if(TextFilled)
        {
            ctx.fillStyle = "#883088";
        }
        else
        {
            ctx.fillStyle = "#555555";
        }
        ctx.fillRect(650,350,150,150);
    }
    if(Screen == 3)
    {
        ctx.fillStyle = "#E0C8A6";
        ctx.fillRect(100,50,600,350);
        
        ctx.fillStyle = "#C2A47C";
        
        // Accessories
        ctx.fillRect(145,325,40,40);
        ctx.fillRect(195,325,40,40);
        ctx.fillRect(245,325,40,40);
        ctx.fillRect(165,80,40,40);
        if(SelectedInventorySlot == 0)
        {
            ctx.strokeStyle = "#606060";
            ctx.strokeRect(165,80,40,40);
        }
        ctx.fillRect(225,80,40,40);
        
        for(let i=0;i<16;i++)
        {
            ctx.fillRect(405+55*(i%4),Math.floor(i/4)*55+115,40,40);
            if(SelectedInventorySlot == i+1)
            {
                ctx.strokeStyle = "#606060";
                ctx.strokeRect(405+55*(i%4),Math.floor(i/4)*55+115,40,40);
            }
        }
        
        ctx.drawImage(TabsImage, 0,0,32,32,383,70,32,32);
        ctx.globalAlpha = 0.375;
        ctx.drawImage(TabsImage, 32,0,32,32,436,70,32,32);
        ctx.drawImage(TabsImage, 64,0,32,32,493,70,32,32);
        ctx.drawImage(TabsImage, 96,0,32,32,545,70,32,32);
        ctx.drawImage(TabsImage, 128,0,32,32,602,76,32,32);
        ctx.globalAlpha = 1.0;
        
        for(let i=0;i<Inventory[0].length;i++)
        {
            ctx.drawImage(WeaponsImage, 32*((Inventory[0][i]-1)%4),32*Math.floor((Inventory[0][i]-1)/4),32,32,409+55*(i%4),Math.floor(i/4)*55+120,32,32);
        }
        // Equiped
        ctx.drawImage(WeaponsImage, 32*((Equipment[0]-1)%4),32*Math.floor((Equipment[0]-1)/4),32,32,169,84,32,32);
        
        if(SelectedInventorySlot == 0)
        {
            ctx.fillStyle = "#606060";
            ctx.font = '24px "BlockyFont"';
            ctx.fillText(WeaponText[Equipment[0]*2],340,350);
            ctx.font = '12px "BlockyFont"';
            drawMultiLineText(WeaponText[Equipment[0]*2+1],343,370,14);
        }
        if(SelectedInventorySlot > 0)
        {
            ctx.fillStyle = "#606060";
            ctx.font = '24px "BlockyFont"';
            ctx.fillText(WeaponText[Inventory[0][SelectedInventorySlot-1]*2],340,350);
            ctx.font = '12px "BlockyFont"';
            drawMultiLineText(WeaponText[Inventory[0][SelectedInventorySlot-1]*2+1],343,370,14);
        }
    }
    // Draw Text Boxes
    for(let i = 0;i<TextBoxes.length;i++)
    {
        TextBoxes[i].Render();
    }
}

function AskQuestion()
{
    let NumberOne = Math.floor(Math.random()*10);
    let NumberTwo = Math.floor(Math.random()*10);
    CurrentQuestion = NumberOne.toString()+" + "+NumberTwo.toString() + " =";
    Answer = [(NumberOne+NumberTwo).toString()];
    
    // TextBox(text, x, y, color, OnlyNumbers, defaultText, type)
    TextBoxes = [new TextBox("", 400, 120, "#000000", true, "Enter Number",1)];
}

window.onload = function()
{
    CalcPS();
    fullscreencanvas();
    loop = setInterval(() => {
        fullscreencanvas();
        update();
        render();
    }, 100/3);
    document.addEventListener('mousedown', function(event){
        mousex = event.offsetX;
        mousey = event.offsetY;
        mousepressed = true;
        
        RelMouseX = 800*(mousex/CanvasW);
        RelMouseY = 450*(mousey/CanvasH);
        //console.log(RelMouseX,RelMouseY);
        
        if(Screen == 1)
        {
            if(Menu == 0)
            {
                // Attack
                if(RelMouseX>250 && RelMouseX<400 && RelMouseY>250 && RelMouseY<350)
                {
                    Screen = 2;
                    AskQuestion();
                    SelectedAction = 0;
                }
                // MAgic
                if(RelMouseX>400 && RelMouseX<550 && RelMouseY>250 && RelMouseY<350)
                {
                    Menu = 1
                }
            }
            else if(Menu == 1)
            {
                // Spell Top Left
                if(RelMouseX>250 && RelMouseX<400 && RelMouseY>250 && RelMouseY<350)
                {
                    Screen = 2;
                    AskQuestion();
                    SelectedAction = 1;
                }
                // Spell Top Right
                if(RelMouseX>400 && RelMouseX<550 && RelMouseY>250 && RelMouseY<350)
                {
                    Screen = 2;
                    AskQuestion();
                    SelectedAction = 2;
                }
                // Spell Bottom Left
                if(RelMouseX>250 && RelMouseX<400 && RelMouseY>350 && RelMouseY<450)
                {
                    Screen = 2;
                    AskQuestion();
                    SelectedAction = 3;
                }
                // Spell Bottom Right
                if(RelMouseX>400 && RelMouseX<550 && RelMouseY>350 && RelMouseY<450)
                {
                    Screen = 2;
                    AskQuestion();
                    SelectedAction = 4;
                }
            }
        }
        else if(Screen == 2)
        {
            SelectedTextBox = -1;
            for(let t=0;t<TextBoxes.length;t++)
            {
                if(TextBoxes[t].CheckMouse())
                {
                    SelectedTextBox = t;
                }
            }
            if(RelMouseX>650 && RelMouseY>300)
            {
                let AnswersCorrect = 0;
                for(let t=0;t<TextBoxes.length;t++)
                {
                    if(TextBoxes[t].text == Answer[t])
                    {
                        AnswersCorrect += 1;
                    }
                }
                Screen = 1;
                Menu = 0;
                
                Accurate = AnswersCorrect == TextBoxes.length;
                
                if(!Accurate)
                {
                    Accurate = Math.random()*100<PlayerAccuracy;
                }
                
                let CQ = 0;
                QueueN = 0;
                
                if(Accurate)
                {
                    // A totally super complex damage formula
                    let d = Math.max(PlayerAtk-EnemyDef,1);
                    
                    // Player Attack
                    Animations.push(new Animation(0, 1, CQ, d));
                    CQ+=1;
                    
                    // Fire Sword
                    if(Equipment[0] == 2 || Equipment[0] == 10)
                    {
                        d = Math.max(PlayerMagic-EnemyMDef,1); // Add Enemy Weaknesses
                        Animations.push(new Animation(1, 1, CQ, d));
                        CQ+=1;
                    }
                    
                    // Lightning Sword
                    if(Equipment[0] == 3 || Equipment[0] == 11)
                    {
                        d = Math.max(PlayerMagic-EnemyMDef,1);
                        Animations.push(new Animation(2, 1, CQ, d));
                        CQ+=1;
                    }
                    
                    // Ice Sword
                    if(Equipment[0] == 4 || Equipment[0] == 12)
                    {
                        d = Math.max(PlayerMagic-EnemyMDef,1); // Add Enemy Weaknesses
                        Animations.push(new Animation(3, 1, CQ, d));
                        CQ+=1;
                    }
                }
                // Enemy Attack
                Animations.push(new Animation(0, 0, CQ, Math.max(EnemyAtk-PlayerDef,1)));
                
                TextBoxes = [];
                SelectedTextBox = -1;
            }
        }
        else if(Screen == 3)
        {
            let ThingSelected = false
            if(RelMouseX>165 && RelMouseX<205 && RelMouseY>80 && RelMouseY<120)
            {
                SelectedInventorySlot = 0;
                ThingSelected = true;
            }
            else
            {
                for(let i=0;i<16;i++)
                {
                    if(RelMouseX>405+55*(i%4) && RelMouseX<445+55*(i%4) && RelMouseY>Math.floor(i/4)*55+115 && RelMouseY<Math.floor(i/4)*55+155)
                    {
                        ThingSelected = true;
                        if(SelectedInventorySlot == i+1)
                        {
                            [Inventory[0][i],Equipment[0]] = [Equipment[0],Inventory[0][i]];
                            SelectedInventorySlot = -1;
                        }
                        else
                        {
                            SelectedInventorySlot = i+1;
                        }
                    }
                }
            }
            if(!ThingSelected)
            {
                SelectedInventorySlot = -1;
            }
            /*ctx.fillRect(145,325,40,40);
            ctx.fillRect(195,325,40,40);
            ctx.fillRect(245,325,40,40);
            ctx.fillRect(165,80,40,40);
            ctx.fillRect(225,80,40,40);
            
            for(let i=0;i<16;i++)
            {
                ctx.fillRect(,,40,40);
            }*/
        }
    });
    
    document.addEventListener('mouseup', function(event){
        mousex = event.offsetX;
        mousey = event.offsetY;
        mousepressed = false;
    });
    
    document.addEventListener('mousemove', function(event){
        mousex = event.offsetX;
        mousey = event.offsetY;
    });
    document.addEventListener('keydown', function(event) {
        if (event.repeat)
        {
            return;
        }
        if(SelectedTextBox>-1)
        {
            TextBoxes[SelectedTextBox].Update(event.key,event.keyCode)
        }
        else
        {
            // w
            if (event.keyCode == 87)
            {
                Keys[0] = true;
                KeyDelay[0] = 0;
            }
            // a
            if (event.keyCode == 65)
            {
                Keys[1] = true;
                KeyDelay[1] = 0;
            }
            // s
            if (event.keyCode == 83)
            {
                Keys[2] = true;
                KeyDelay[2] = 0;
            }
            // d
            if (event.keyCode == 68)
            {
                Keys[3] = true;
                KeyDelay[3] = 0;
            }
            // Inventory
            if (event.key == 'i')
            {
                Screen = 3;
            }
            // Fight
            if(event.key == 'b')
            {
                LoadBattle(0);
            }
        }
    });
  document.addEventListener('keyup', function(event) {
      if (event.repeat)
      {
          return;
      }
      // w
      if (event.keyCode == 87)
      {
          Keys[0] = false;
          KeyDelay[0] = 0;
      }
      // a
      if (event.keyCode == 65)
      {
          Keys[1] = false;
          KeyDelay[1] = 0;
      }
      // s
      if (event.keyCode == 83)
      {
          Keys[2] = false;
          KeyDelay[2] = 0;
      }
      // d
      if (event.keyCode == 68)
      {
          Keys[3] = false;
          KeyDelay[3] = 0;
      }
  });
}
