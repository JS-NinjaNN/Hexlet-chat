import { useDispatch, useSelector } from 'react-redux';

import { Modal } from 'react-bootstrap';

import { selectors as modalSelectors, actions as modalActions } from '../../../slices/modalSlice.js';
import Add from './Add.jsx';
import Rename from './Rename.jsx';
import Remove from './Remove.jsx';

const modalMap = {
  add: Add,
  rename: Rename,
  remove: Remove,
};

const ModalWindow = () => {
  const dispatch = useDispatch();
  const modalType = useSelector(modalSelectors.getModalType);
  const isOpened = useSelector(modalSelectors.isModalOpened);
  const handleClose = () => dispatch(modalActions.close());

  const CurrentModal = modalMap[modalType];

  return (
    <Modal show={isOpened} onHide={handleClose}>
      {CurrentModal && <CurrentModal handleClose={handleClose} />}
    </Modal>
  );
};

export default ModalWindow;
