<?php
class User{
	private $_db,
			$_data,
			$_sessionName,
			$_isLoggedIn;		

	public function __construct($user = null){
		$this->_db = DB::getInstance();
		$this->_sessionName = Config::get('session/session_name');
		if(!$user){
			if(Session::exists($this->_sessionName)){
				$user = Session::get($this->_sessionName);
				if(!$this->find($user)){
					$this->_isLoggedIn = true;
				}else{
					//process log out;
				}
			} 
		}else{
			$this->find($user);
		}
	}

	public function create($fields = array()){
		if(!$this->_db->insert('t_user_dd',$fields)){
			throw new Exception('there was a problem creating an account!');
		}
	}
	public function find($user = null){
		if($user){
			$field = (is_numeric($user)) ? 'mobile' : 'username';
			$data =$this->_db->get('t_user_dd',array($field, '=' ,$user));
			if($data->count()){
				$this->_data = $data->first();
				return true;
			}
		}
		return false;
	}

	public function findbyfield($field,$value){
		if($field){
			$data =$this->_db->get('t_user_dd',array($field, '=' ,$value));
			if($data->count()){
				$this->_data = $data->first();
				return array(
					'username' => $this->_data->username,
				);
			}
		}
		return false;
	}

	public function login($username = null, $password = null){
		$user = $this->find($username);
		if($user){
			if($this->data()->password === Hash::make($password, $this->data()->salt)){
				Session::put($this->_sessionName,$this->data()->id);
				return true;
			}
		}
		return false;
	}

	public function data(){
		//var_dump($this->user_data);die;
		return $this->_data;
	}

	public function isLoggedIn(){
		return $this->_isLoggedIn;
	}

	public function logout(){
		Session::delete($this->_sessionName);
	}
}