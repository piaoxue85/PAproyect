@extends('master')
@section('jscript'){{asset('generalJs/users.js')}}@endsection
@section('title', 'Login')

@section('content')
<form action="login" method="POST">
	@if (count($errors) > 0)
		<div class="alert alert-danger">
		<li>{{ $errors->first('auth')  }}</li>
			</div>
    <br>

	@endif
		<input name="email" type="text" placeholder="Usuario" value="{{ old('email') }}"/>
		<br>
		<input name="password" type="password" placeholder="Contraseña" />
		<br>
		<input type="submit" value="Entrar" />
        <a href="regForm">Registrarse</a>
</form>
@endsection

