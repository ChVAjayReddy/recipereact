import React from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");
const ModalUI=(props)=>{
    const{isOpen,index,modalIsOpen,setmodalIsOpen}=props;
    if(!isOpen){
        return null;
    }
    return(
        <Modal>

        
    <div >
     

     <button onClick={()=>setmodalIsOpen(false)}>X</button>
    </div>

        </Modal>
    )

}
export default ModalUI;