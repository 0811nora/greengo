import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getSingleProduct } from '../api/ApiClient';

export default function ProductDetail({ isOpenDetailModal, handleCloseDetailModal }) {
	const { id } = useParams();
	const [productDetail, setProductDetail] = useState(null);
	useEffect(() => {
		const getProductDetail = async () => {
			try {
				const res = await getSingleProduct(id);
				setProductDetail(res.data.product);
			} catch (error) {
				console.log(error.response);
			}
		};
		getProductDetail();
	}, [id]);
	return (
		<Modal
			show={isOpenDetailModal}
			onHide={handleCloseDetailModal}
			dialogClassName="modal-90w"
			aria-labelledby="productDetailModal"
			size="xl"
		>
			<Modal.Header closeButton>
				<Modal.Title id="productDetailModal">{productDetail?.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container">
					<div className="col-6">圖片</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleCloseDetailModal}>
					Close
				</Button>
				<Button variant="primary">Save Changes</Button>
			</Modal.Footer>
		</Modal>
	);
}
