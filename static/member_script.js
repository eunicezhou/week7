let form = document.getElementById("form");
const container = document.getElementById("container");
let button = document.querySelector("#message");
let username = `{{username}}`;
let content = `{{content}}`;
button.addEventListener("click",function leaveMessage(){
    let newContainer = document.createElement("div")
    newContainer.innerHTML=`
    <div>
        <div class='userPhoto'>
            <img src = '../static/image/user.png' style='width:40px'></img>\
            <div> ${username}</div>
        </div>
        <div class='text'> ${content}</div>
    </div>`
    container.appendChild(newContainer)
})

document.getElementById("searchName").addEventListener('submit', async function(event) {
    event.preventDefault();
    const searchInput = document.querySelector('input[name="name"]');
    const searchValue = searchInput.value;

    const response = await fetch(`http://127.0.0.1:3000/api/member?name=${searchValue}`);
    const data = await response.json();

    const showDiv = document.getElementById('show');
    if (data.data) {
        const resultHTML = `
            <p>Name: ${data.data.name}</p>
        `;
        showDiv.innerHTML = resultHTML;
    } else {
        showDiv.innerHTML = '該用戶不存在';
    }
});

const icon = document.querySelectorAll("nav a");
for(i=0;i<icon.length;i++){
    icon[i].addEventListener("mouseenter", function (){
        let span = document.createElement("span");
        if(this.id === "signout"){
            span.innerHTML = "Sign out";
        }else{
            span.innerHTML = "Reset Username" 
        }  
        this.appendChild(span);
    });
    icon[i].addEventListener("mouseleave",function (){
        let span = this.querySelector("span");
        if(span){
            this.removeChild(span);
        }
    })
}

const reset = document.getElementById('setting');
reset.addEventListener("click",()=>{
    let updateName = document.createElement("div");
    let containerChild = container.appendChild(updateName);
    containerChild.id = "resetUsername";
    updateName.innerHTML= `
            <input type="text" id="name" name="updatename" placeholder="輸入新帳號">
            <div id="fakeButton">更新</div>`;
    const fakeButton = document.getElementById('fakeButton');
    const h2 = document.querySelector("h2");
    fakeButton.addEventListener("click", function() { 
        let name = document.getElementById("name");
        let new_name = name.value;
	    fetch('/api/member', { 
            method: 'PATCH', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"name":new_name,})
        }) 
	    .then(response => response.json()) 
	    .then(data => { 
            if(data.ok){
                h2.innerHTML = `Hello,${new_name}`;
                window.alert("更新成功");
            }else{
                window.alert("更新失敗，請再試一次")
            }
	    }) .catch(error => { 
		console.log("過程有問題") 
	    }); 
        container.removeChild(updateName);
    });
})



