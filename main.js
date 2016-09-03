Counter = (function(options){
	return{
		init: function(){
			var self = this;
			this._worker = this._buildWorker(this._loop);

			this.button = document.createElement('button');
			this.button.appendChild(document.createTextNode("Reset " + options.order + " count"));

			this.button.onclick = function(){
				self._worker.postMessage({
					reset: true
				});
			};

			this.textfield = document.createElement('input');
			this.textfield.setAttribute('readonly', true);

			this._worker.onmessage = function(e){
				// setTimeout(function() {
					self._logMessage(e);
				// }, 100);
				// this.postMessage({});
				// self.textfield.value = options.order + ': ' +  e.data.count;
			}

			document.body.appendChild(this.button);
			document.body.appendChild(this.textfield);

			this._worker.postMessage({
				order: options.order,
			});
		},

		_loop: function(){
			var i = 0;

			this.onmessage = function(e){
				if(e.data.order){
					this.order = e.data.order;
				}else if(e.data.reset){
					i = 0;
				}else{
					this.order == 'ASC' ? i++ : i--;
				}

				this.postMessage({
					count: i
				});
			}
		},

		// Building WebWorker without needing external file
		_buildWorker: function(callback){
			var blobUrl = new Blob([ '(',
					callback.toString(),
				')()'], { 
					type: 'application/javascript'
				});

			return new Worker(URL.createObjectURL(blobUrl));
		},

		_logMessage: function(e){
			var self = this;

			// self._sleep(100).then(() => {
				self._worker.postMessage({});
				self.textfield.value = options.order + ': ' +  e.data.count;
			// });
		},

		_sleep: function(time){
			return new Promise((resolve) => setTimeout(resolve, time));
		}
	};
});