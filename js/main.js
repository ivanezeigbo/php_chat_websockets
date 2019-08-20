$(document).ready(function(){
	var conn = new WebSocket('ws://localhost:8080'),
	 sendBtn = $(".send_btn"),
	 messageInputField = $(".type_msg"),
	 messagesList = $(".messages-list");
	 connectionList = $(".connections-list");

	 $('#action_menu_btn').click(function(){
	 	$('.action_menu').toggle();
	 });

	sendBtn.click(function(){
		var message = messageInputField.val();
		conn.send(message);
		messagesList.append(`<div class="d-flex justify-content-end mb-4">
			<div class="msg_cotainer_send">`+message+`
				<span class="msg_time_send">8:55 AM, Today</span>
			</div>
			<div class="img_cont_msg">
		<span><img src="https://i.pinimg.com/originals/54/6e/6d/546e6d4c6ce4322e6aa3b2f8ca73ac28.jpg" class="rounded-circle user_img_msg"></span>
			</div>
		</div>`);
		messageInputField.val("");
	})

	conn.onopen = function(e){

	}
	conn.onmessage = function(e){
 		data = JSON.parse(e.data);
		if (data['is_message'] == 'yes'){
			messagesList.append(`<div class="d-flex justify-content-start mb-4">
				<div class="img_cont_msg">
					<span><img src="https://i.pinimg.com/originals/54/6e/6d/546e6d4c6ce4322e6aa3b2f8ca73ac28.jpg" class="rounded-circle user_img_msg"></span>
				</div>
				<div class="msg_cotainer">`+data['message']+`
					<span class="msg_time">8:40 AM, Today</span>
				</div>
			</div>`);
		}
		else{
			client = data['client'];
			if (data['status'] == 'open'){
				if ($('#stat_'+String(client)).length > 0){
					$('#stat_'+String(client)).removeClass('offline');
				}
				else{
					connectionList.append(`<li>
						<div class="d-flex bd-highlight">
							<div class="img_cont">
								<img src="https://i.pinimg.com/originals/54/6e/6d/546e6d4c6ce4322e6aa3b2f8ca73ac28.jpg" class="rounded-circle user_img">
								<span class="online_icon" id="stat_`+String(client)+`"></span>
							</div>
							<div class="user_info">
								<span>User `+client+`</span>
								<p id="detail_`+String(client)+`">User `+client+` joined the chat</p>
							</div>
						</div>
					</li>`);
				}
			}
			else{
				$('#stat_'+String(client)).addClass('offline');
				$('#detail_'+String(client)).text(`User `+client+` left the chat`)
			}
		}
	}

	conn.onclose = function(e){
	}
});
