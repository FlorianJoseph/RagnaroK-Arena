<template>
  <div class="flex flex-wrap mb-4 bg-gray-100 p-1.5 rounded-lg shadow-sm w-96 text-sm">
    <label class="flex-1 text-center">
      <input type="radio" name="radio" checked class="hidden" />
      <span
        class="flex items-center justify-center cursor-pointer py-2 px-0 rounded-lg text-gray-700 transition-all duration-150 ease-in-out hover:bg-gray-200 hover:font-semibold">
        <NuxtLink to="/tournois">Tournois</NuxtLink>
      </span>
    </label>
    <label class="flex-1 text-center">
      <input type="radio" name="radio" class="hidden" />
      <span
        class="flex items-center justify-center cursor-pointer py-2 px-0 rounded-lg text-gray-700 transition-all duration-150 ease-in-out hover:bg-gray-200 hover:font-semibold">
        <NuxtLink to="/tournois/favoris">Favoris</NuxtLink>
      </span>
    </label>
    <label class="flex-1 text-center">
      <input type="radio" name="radio" class="hidden" />
      <span
        class="flex items-center justify-center cursor-pointer py-2 px-0 rounded-lg text-gray-700 transition-all duration-150 ease-in-out hover:bg-gray-200 hover:font-semibold">
        <NuxtLink to="/tournois/mes-tournois">Mes tournois</NuxtLink>
      </span>
    </label>
    <label class="flex-1 text-center">
      <input type="radio" name="radio" class="hidden" />
      <span
        class="flex items-center justify-center cursor-pointer py-2 px-0 rounded-lg text-gray-700 transition-all duration-150 ease-in-out hover:bg-gray-200 hover:font-semibold">
        <NuxtLink to="/tournois/nouveau">Nouveau</NuxtLink>
      </span>
    </label>
  </div>
</template>
