const cl = console.log;



const postform = document.getElementById("postform");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content")
const createpost = document.getElementById("createpost");
const updateBtn = document.getElementById("updateBtn");
const postContainer = document.getElementById("postContainer")



const templating =(arr)=>{
    let result ='';
    arr.forEach(ele => {
        result += `
            <div class="card mb-4" id="${ele.id}">
            <div class="card-header">
                <h3>${ele.title}</h3>
            </div>
            <div class="card-body">
                <p>${ele.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                <button class="btn btn-danger"  onclick="onDeletBtn(this)">Delete</button>

            </div>
            </div>

        `
    });
    postContainer.innerHTML=result;
}


let baseUrl = 'https://fir-xhr-promise-default-rtdb.asia-southeast1.firebasedatabase.app/';
let postUrl =`${baseUrl}/posts.json`


const makeApicall = (methodName,apiUrl,body)=>{
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open(methodName,apiUrl);

        xhr.onload = function(){
            if (xhr.status >= 200 || xhr.status <= 300) {
                resolve(xhr.response)
            }else{
                reject('Something Went Wrong')
            }
        }
        xhr.send(JSON.stringify(body));

    })
    
}
makeApicall("GET",postUrl)
    .then(res => {
        cl(res)
        let Data = JSON.parse(res);
        // cl(Data)
        let postArray = [];
        
        for(let k in Data){
           let obj1 = {
            ...Data[k],
            id : k
           }
        postArray.push(obj1)
        
        }
        templating(postArray);
    })
    .catch(cl)


postform.addEventListener("submit", (e) => {
    e.preventDefault();
    let obj={
        title : titleControl.value,
        body : contentControl.value.trim()
    }
    makeApicall("POST",postUrl, obj)
        .then(res => {
            cl(res)
            let postdata = JSON.parse(res);
            let card = document.createElement("div");
            card.id = postdata.name;
            card.className = 'card mb-4'

            let result = ` <div class="card-header">
                                <h3>${obj.title}</h3>
                            </div>
                            <div class="card-body">
                                 <p>${obj.body}</p>
                             </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-info" onclick="onEditBtn(this)">Edit</button>
                                <button class="btn btn-danger"  onclick="onDeletBtn(this)">Delete</button>

                            </div>`

                            card.innerHTML = result;
                            
                            postContainer.append(card);
                            postform.reset()
        })
        
        
        .catch(cl)
})

const onEditBtn = (eve) => {
    let editId = eve.closest(".card").id;
    localStorage.setItem("editId" , editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`
    
    makeApicall("GET",editUrl)
        .then(res =>{
            cl(res)
            let EditData = JSON.parse(res)
            titleControl.value = EditData.title,
            contentControl.value= EditData.body
        })
        .catch(cl)
        .finally(() => {
            createpost.classList.add("d-none");
            updateBtn.classList.remove("d-none")
        })
}

updateBtn.addEventListener("click", (e)=>{
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}.json`


    let obj={
        title : titleControl.value,
        body : contentControl.value.trim()
    } 
    makeApicall("PATCH", updateUrl, obj)
        .then(res => {
            cl(res)
            let UpdateCard =[...document.getElementById(updateId).children]
            UpdateCard[0].innerHTML=  `<h3>${obj.title}</h3>`;
            UpdateCard[1].innerHTML = ` <p>${obj.body}</p>`;
            
        })
        .catch(cl)
        .finally(() => {
            postform.reset()
            createpost.classList.remove("d-none");
            updateBtn.classList.add("d-none")
        })

})

 const onDeletBtn = (eve) =>{
    let deleteId = eve.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}.json`
    makeApicall("DELETE", deleteUrl)
        .then(res => {
            cl(res)
        

            let deleteId1 = document.getElementById(deleteId);
            deleteId1.remove()
            cl(deleteId1)
           
        })
        .catch(cl)
 }
 
 

