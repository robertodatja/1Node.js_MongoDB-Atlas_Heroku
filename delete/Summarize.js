/*
So to summarize
when we first load up our home page,
we go through this route app.get()
and we render our list.ejs passing in two variables: one called kindOfDay and another called newListItems.

Now newListItems is set to equal the items array which starts off containing three strings, buy food,cook food,eat food.

And this gets passed into the list.ejs under this variable name newListItems.
And over here we have a for loop that loops through the entire length of the newListItems array and
it renders a new LI for each item inside the array.

Now when a user adds a new item through the text input then that gets saved under the variable name newItem
and
we trigger a post request to the home route which will be caught by this block of code.
And when we're inside this block of code we grab hold of the value of the newItem,
so whatever it is that the user typed inside here,
and then we save it to a variable called item and we add that item to our array called items.
And then we redirect to the home route.

So now we go back over here app.get(...)
but the items array has now increased by a size of one and our new item get pushed onto the end of the array.

And now we're able to go ahead and render list again and pass over the now updated array with all of our list items.

So this is a really fundamental part of templating and that is passing data through from the server
to our template and populating it with dynamic content.
*/



/*
Now what I recommend as good practice is to try and avoid using this keyword var.
Now we've been using it up till this point because we weren't yet ready to talk about scope.
But now that we understand how it works, it's much safer and more predictable to try and always use let or const whenever you can.
There are very very few scenarios where you will need to use the keyword var.
And in fact going forward whenever you want to write the word var replace it with let instead.
Now this again is a new concept and Javascript has a number of peculiarities that can be difficult forbeginners to grasp.

So in the resources section of this lesson I've included some reading material and some background reading
for you to really get to grips with this concept and also I'd recommend trying it out using let, const
and var inside the Chrome developer tools inside the console and trying to use and access and change these
variables when they're created inside a function or outside a function or inside an IF statement so
that you really understand what's going on yourself.

Now in the next lesson we are going to be getting on and styling our to do list to make it look the
part instead of just working the part.
*/
