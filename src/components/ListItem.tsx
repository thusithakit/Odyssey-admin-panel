import React from 'react'

interface ListItemProps {
    item: {
        id: string;
        username?: string;
        title?: string;
        image_url?: string;
        imgUrl?: string[];
    }
    apiName: string;
    handleModalOpen: (id: string) => void;
    handleEdit: (id: string) => void;
}

function ListItem({ item, apiName, handleModalOpen, handleEdit }: ListItemProps) {


    return (
        <div className='list-set-item'>
            <div className='flex relative justify-center items-center gap-5'>
                {item.image_url && item.image_url.length > 0 && <img loading='lazy' className='list-image' src={item.image_url[0]} alt="img" />}
                {item.imgUrl && item.imgUrl.length > 0 && <img loading='lazy' className='list-image' src={item.imgUrl[0]} alt="img" />}
                <p className='pl-5'>{item.username || item.title}</p>
            </div>
            <div className="buttons py-2">
                {apiName != 'users' ? <button className='btn-edit' onClick={() => handleEdit(item.id)}>Edit</button> : null}
                <button className='btn-delete' onClick={() => handleModalOpen(item.id)}>Delete</button>
            </div>
        </div>
    )
}

export default ListItem
