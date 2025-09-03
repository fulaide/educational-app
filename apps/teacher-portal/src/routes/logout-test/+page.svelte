<div class="p-8">
	<h1 class="text-2xl font-bold mb-4">Logout Test</h1>
	<p class="mb-4 text-gray-600">This page should stay visible.</p>
	
	<!-- Simple server-side logout -->
	<form method="POST" action="?/logout">
		<button 
			type="submit"
			class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
		>
			Sign Out (server-side)
		</button>
	</form>
	
	<!-- Direct logout link -->
	<p class="mt-4">
		<a href="/auth/signout" class="text-blue-600 underline">
			Or try direct Auth.js signout link
		</a>
	</p>
	
	<p class="mt-4 text-sm text-gray-500">After logout, manually go to /auth/signin to test signin page</p>
</div>