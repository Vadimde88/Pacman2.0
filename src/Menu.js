var Menu = function(title, x, y, w, h, pad, font, fontcolor) {
    this.title = title;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.pad = pad;
    this.buttons = [];
    this.buttonCount = 0;
    this.currentY = this.y + this.pad;

    if (title) {
        this.currentY += 1 * (this.h + this.pad);
    }

    this.font = font;
    this.fontcolor = fontcolor;
    this.enabled = false;
    this.backButton = undefined;
};

Menu.prototype = {

    clickCurrentOption: function() {
        var i;
        for (i = 0; i < this.buttonCount; i++) {
            if (this.buttons[i].isSelected) {
                this.buttons[i].onclick();
                break;
            }
        }
    },

    selectNextOption: function() {
        var i;
        var nextBtn;
        for (i = 0; i < this.buttonCount; i++) {
            if (this.buttons[i].isSelected) {
                this.buttons[i].blur();
                nextBtn = this.buttons[(i + 1) % this.buttonCount];
                break;
            }
        }
        nextBtn = nextBtn || this.buttons[0];
        nextBtn.focus();
    },

    selectPrevOption: function() {
        var i;
        var nextBtn;
        for (i = 0; i < this.buttonCount; i++) {
            if (this.buttons[i].isSelected) {
                this.buttons[i].blur();
                nextBtn = this.buttons[i == 0 ? this.buttonCount - 1 : i - 1];
                break;
            }
        }
        nextBtn = nextBtn || this.buttons[this.buttonCount - 1];
        nextBtn.focus();
    },

    addToggleButton: function(isOn, setOn) {
        var b = new ToggleButton(this.x + this.pad, this.currentY, this.w - this.pad * 2, this.h, isOn, setOn);
        this.buttons.push(b);
        this.buttonCount++;
        this.currentY += this.pad + this.h;
    },

    addTextButton: function(msg, onclick) {
        var b = new Button(this.x + this.pad, this.currentY, this.w - this.pad * 2, this.h, onclick);
        b.setFont(this.font, this.fontcolor);
        b.setText(msg);
        this.buttons.push(b);
        this.buttonCount++;
        this.currentY += this.pad + this.h;
    },

    addHighScoresButton: function() {
        var b = new Button(this.x + this.pad, this.currentY, this.w - this.pad * 2, this.h, this.viewHighScores.bind(this));
        b.setFont(this.font, this.fontcolor);
        b.setText("High Scores");
        this.buttons.push(b);
        this.buttonCount++;
        this.currentY += this.pad + this.h;
    },

    viewHighScores: function() {
        // Here you would add the logic to display the high scores
        var highScores = this.getHighScores();
        alert("High Scores:\n" + highScores.join("\n"));
    },

    getHighScores: function() {
        // Retrieve high scores from localStorage (or use a backend)
        var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        return highScores;
    },

    saveHighScore: function(name, score) {
        // Get the current high scores from localStorage
        var highScores = this.getHighScores();
        
        // Add the new score
        highScores.push({ name: name, score: score });
        
        // Sort by score (descending order) and keep only the top 5
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        
        // Save the new high scores back to localStorage
        localStorage.setItem("highScores", JSON.stringify(highScores));
    },

    enable: function() {
        var i;
        for (i = 0; i < this.buttonCount; i++) {
            this.buttons[i].enable();
        }
        this.enabled = true;
    },

    disable: function() {
        var i;
        for (i = 0; i < this.buttonCount; i++) {
            this.buttons[i].disable();
        }
        this.enabled = false;
    },

    isEnabled: function() {
        return this.enabled;
    },

    draw: function(ctx) {
        if (this.title) {
            ctx.font = tileSize + "px ArcadeR";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFF";
            ctx.fillText(this.title, this.x + this.w / 2, this.y + this.pad + this.h / 2);
        }
        var i;
        for (i = 0; i < this.buttonCount; i++) {
            this.buttons[i].draw(ctx);
        }
    },

    update: function() {
        var i;
        for (i = 0; i < this.buttonCount; i++) {
            this.buttons[i].update();
        }
    },
};