window.onload = function(){
	function Game(time){
		this.row = 3;
		this.line = 3;
		this.margin = 20;
		this.width = 100;
		this.body = $("#body")[0];
		this.arr = [];
		this.score = 0;
		this.time = time;
	}
	Game.prototype = {
		init : function(){
			for(var i = 0; i <= this.row; i++){
				this.arr[i] = [];
				for(var j = 0; j <= this.line; j++){
					this.arr[i][j] = 0;
					var block = document.createElement("div");
					var cell = document.createElement("div");
					block.className = "block";
					block.id = `block-${i}-${j}`;
					cell.id = `cell-${i}-${j}`;
					cell.className = "cell";
					block.style.left = this.getLocation(j);
					block.style.top = this.getLocation(i);
					cell.style.left = this.getLocation(j);
					cell.style.top = this.getLocation(i);
					this.body.appendChild(block);
					this.body.appendChild(cell);
				}
			}
			this.createRandomNumber();
			this.createRandomNumber();
			this.addKeydownEvent();
		},
		getLocation : function(x){
			return this.margin + x *(this.width + this.margin) + "px";
		},
		createRandomNumber : function(){
			var randomI=Math.floor(Math.random()*this.row);
            var randomJ=Math.floor(Math.random()*this.line);
            while(true){
                if(this.arr[randomI][randomJ] === 0){
                    break;
                }else{
                    randomI = Math.floor(Math.random() * (this.row + 1));
                    randomJ = Math.floor(Math.random() * (this.line + 1));
                }
            }
            var randomNumber=Math.random() < 0.75 ? 2 : 4;
			this.arr[randomI][randomJ] = randomNumber;
			this.setCellStyle(randomI,randomJ);
			this.score += this.arr[randomI][randomJ];
			this.updateScore();
		},
		updateScore : function(){
			document.getElementById("title-top-score").getElementsByTagName("em")[0].innerHTML = this.score;
		},
		setCellStyle : function(i,j){
			var _this = this;
			setTimeout(function(){
				var cell = $(`#cell-${i}-${j}`)[0];
				if(_this.arr[i][j] !== 0){
					cell.innerHTML = _this.arr[i][j];
					cell.className = `cell cell_${ _this.arr[i][j] }`;
				}else{
					cell.innerHTML = "";
					cell.className = "cell";
				}
			},this.time);
		},
		cover : function(cell,target,i,j,k,code){
			this.arr[code %2 === 0 ? i : k][code %2 === 0 ? k : j] += this.arr[i][j];
			cell.innerHTML = this.arr[code %2 === 0 ? i : k][code %2 === 0 ? k : j];
			cell.className = `cell cell_${ code %2 === 0 ? this.arr[i][k] : this.arr[k][j] }`;
			target.innerHTML = "";
			target.className = "cell";
		},
		getRange : function(code){
			switch(code){
				case 0 :
				return[0,1,3,3];
				case 1 :
				return[1,0,3,3];
				case 2 :
				return[3,2,0,0];
				case 3 :
				return[2,3,0,0];
			}
		},
		canMove : function(code){
			var range = this.getRange(code);
			for(var i = range[2]; range[2] < range[0] ? i <= range[0] : i >= range[0]; range[2] < range[0] ? i++ : i--){
				for(var j = range[3]; range[3] < range[1] ? j <=range[1] : j >= range[1]; range[3] < range[1]? j++ : j--){
					if(this.arr[i][j] === 0)continue;
					var before = this.arr[code %2 === 0 ? i : code === 1 ? i - 1 : i + 1]
					[code %2 === 0 ? code === 0 ? j - 1 : j + 1 : j];
					if(before === 0 || before  === this.arr[i][j]){
						return true;
					};
				}
			}
			this.isKeydown = true;
			return false;
		},
		move : function(code){
			if(!this.canMove(code))return;
			var range = this.getRange(code);
			var _this = this;
			for(var i = range[0]; range[0] < range[2] ? i <= range[2] : i >= range[2]; range[0] < range[2] ? i++ : i--){
				for(var j = range[1]; range[1] < range[3] ? j <=range[3] : j >= range[3]; range[1] < range[3]? j++ : j--){
					if(this.arr[i][j] === 0 ) continue;
					for(var k = code === 0 || code === 1 ? 0 : 3;
						code %2 === 0 ? code === 0 ? k < j : k > j:code === 1 ? k < i : k > i; 
						code === 0 || code === 1 ? k++ : k--){
							if(code %2 === 0 ? this.arr[i][k] === this.arr[i][j] || this.arr[i][k] === 0 
							:this.arr[k][j] === this.arr[i][j] || this.arr[k][j] === 0){

								if(!this.noMiddleNumRow(code,i,j,k))continue;

								var cell = $(`#cell-${i}-${j}`)[0];
	                            var target = code %2 === 0 ? $(`#cell-${i}-${k}`)[0] : $(`#cell-${k}-${j}`)[0];

	                            if(code %2 === 0 ? this.arr[i][k] === this.arr[i][j] : this.arr[k][j] === this.arr[i][j]){
	                            	this.cover(cell,target,i,j,k,code);
	                        	}else{
	                        		this.arr[code %2 === 0 ?i : k][code %2 === 0 ? k : j] = this.arr[i][j];
	                        	}
	                        	this.arr[i][j] = 0;
							 	this.moveView(cell,target,i,j,k,code);
							 	break;
							}
						}
				}
			}
			this.createRandomNumber();
			if(this.isGameover())this.gameover();
		},
		moveView : function(cell,target,i,j,k,code){
	        var pos = code %2 === 0 ? cell.style.left : cell.style.top;
			cell.style.transition = `all ${this.time / 1000}s ease`;
			if(code %2 === 0){
				cell.style.left = target.style.left;
				target.style.left = pos;
			}else{
				cell.style.top = target.style.top;
				target.style.top = pos;
			}
		    cell.id = code %2 === 0 ? `cell-${i}-${k}` : `cell-${k}-${j}`;
		    target.id = `cell-${i}-${j}`;
		},
		noMiddleNumRow : function(code,i,j,k){
			for(var x = code === 0 || code === 1 ? k + 1 : k - 1;
				code %2 === 0 ? code === 0 ? x < j : x > j : code === 1 ? x < i : x > i;
				code === 0 || code === 1 ? x++ : x--){
				if(this.arr[code %2 === 0 ? i : x][code %2 === 0 ? x : j] !=0){
					return false;
				}
			}
            return true;
		},
		isGameover : function(){
			if(!this.canMove(0) && !this.canMove(1) && !this.canMove(2) && !this.canMove(3)){
				return true;
			}
		},
		addKeydownEvent : function(){
			this.isKeydown = true;
			var _this = this;
			var touchstartX,touchstartY,touchendX,touchendY;
			document.onkeydown = function(e){
				if(_this.isKeydown){
					_this.isKeydown = false;
					setTimeout(()=>{_this.isKeydown = true},80);
					var code = e.keyCode - 37;
					if(code >=0 && code <=3)_this.move(code);
				}
			}
			document.addEventListener("touchstart",function(event){
				touchstartX = event.touches[0].clientX;
				touchstartY = event.touches[0].clientY;
			});
			document.addEventListener("touchmove",function(event){
				touchendX = event.touches[0].clientX;
				touchendY = event.touches[0].clientY;
			});
			document.addEventListener("touchend",function(){
				var touchMoveDistanceX = touchstartX - touchendX;
				var touchMoveDistanceY = touchstartY - touchendY;
				
				if(Math.abs(touchMoveDistanceX) > Math.abs(touchMoveDistanceY)){
					if(Math.abs(touchMoveDistanceX) > 100){
						touchMoveDistanceX > 0 ? _this.move(0) : _this.move(2);
					}
				}else{
					if(Math.abs(touchMoveDistanceY) > 100){
						touchMoveDistanceY > 0 ? _this.move(1) : _this.move(3);
					}
				}
			});
			$("#newgame")[0].onclick = function(){_this.newGame()};
		},
		gameover : function(){
			var _this = this
			var gameover = $('#gameover')[0];
			var newGameBtn = $("#newgame")[0];
			newGameBtn.onclick = null;
			gameover.classList.add('show');
			gameover.onclick = function(){
				gameover.onclick = null;
				newGameBtn.onclick = _this.newGame;
				gameover.classList.remove('show');
				_this.newGame();
			};
		},
		newGame : function(){
			var body = document.createElement("div");
			body.id = "body";
			this.body = body;
			$("#container")[0].removeChild($("#body")[0]);
			$("#container")[0].appendChild(body);
			this.score = 0;
			this.init();
		}
	}
	window.game = new Game(60);
	game.init();
}