<?php

namespace ChatApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;


class Chat implements MessageComponentInterface{
	protected $clients;

	function __construct(){
		$this->clients = new \SplObjectStorage;
	}

	public function onOpen(ConnectionInterface $conn){
		$this->clients->attach($conn);
		$tot = json_encode((object)array('is_message'=>'no', 'client'=>$conn->resourceId, 'status'=>'open'));
		foreach ($this->clients as $client) {
			$client->send($tot);
		}
	}

	public function onMessage(ConnectionInterface $from, $msg){
		$tot = json_encode((object)array('is_message'=>'yes', 'message'=>$msg));
		foreach ($this->clients as $client) {
			if($client !== $from){
				$client->send($tot);
			}
		}
	}

	public function onClose(ConnectionInterface $conn){
		$this->clients->detach($conn);
		$tot = json_encode((object)array('is_message'=>'no', 'client'=>$conn->resourceId, 'status'=>'close'));
		foreach ($this->clients as $client) {
			$client->send($tot);
		}
	}

	public function onError(ConnectionInterface $conn, \Exception $e){
		echo "An error has occured: {$e->getMessage()}";
		$conn->close();
	}

}

?>
