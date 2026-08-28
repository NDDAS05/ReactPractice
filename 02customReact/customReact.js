// React typically injects these dom elements by creating a tree like structure.
// We can try to simulate that. Say we want to insert a "a" tag.
// Go to mainContainer first.


const reactElement ={
    // type : element tag
    type:"a",

    //props : an object that has the attributes of "a" tag. Like href, target etc etc
    props:{
        href:"https://www.google.com", // needed otherwise browser treates as "relative path" and searches for www.google.com file
        target:"_blank",
    },

    // Children : the actual content enclosed IN the <a> tag.
    children: "Click here to vist Google.",
}

// Now we will need a function App(){ return (<a>...</a>) } equivalent of react.
function customRender(reactElement, container) // This func takes reactElement(what to render), and container (where to render)
{
    // Now we need to create a "element" of type reactElement.type and have its innerHTML set to reactElement.children.
    const element = document.createElement(reactElement.type);

    // set innerText
    element.innerText = reactElement.children;

    // set attributes using for...in loop
    for(const prop in reactElement.props){
        if(prop === 'children') continue; // previously sometimes children was in props
        element.setAttribute(prop, reactElement.props[prop]);
    }
    // in case children was in props
    // element.innerText = reactElement.props[children];

    // Now actually "injecting" the element in the container.
    container.append(element);
}

//---------------Starts Here-------------------------


const mainContainer = document.querySelector("#root"); // This is where we will inject dom elements.
customRender(reactElement, mainContainer);

// For this we need to get the element that we want to insert.
// How should a "a" tag look like after being compiled by react? Refer above object


