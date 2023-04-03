import React from 'react';
import { useDispatch } from 'react-redux';
import { BsPlusCircle } from 'react-icons/bs';
import {
  Nav, Button, Dropdown, ButtonGroup, Col,
} from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import * as channelsSlice from '../../../slices/channelsSlice.js';
import * as modalSlice from '../../../slices/modalSlice.js';
import ChannelName from '../../common/ChannelName.jsx';

const PersistentChannel = ({
  name, isActive, variant, onSelect,
}) => (
  <Button active={isActive} variant={variant} className="text-start w-100 border-0 pe-2 py-2 d-flex align-items-center" onClick={onSelect}>
    <div className="me-auto text-truncate">
      <ChannelName name={name} />
    </div>
    <div className="d-flex align-items-center">
      <FaLock />
    </div>
  </Button>
);

const RemovableChannel = ({
  name, isActive, variant, onSelect, handleRename, handleRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button active={isActive} variant={variant} className="text-truncate text-start w-100 border-0 py-2" onClick={onSelect}>
        <ChannelName name={name} />
      </Button>

      <Dropdown.Toggle active={isActive} split variant={variant} className="border-0">
        <span className="visually-hidden">{t('channelControl')}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRename}>{t('rename')}</Dropdown.Item>
        <Dropdown.Item onClick={handleRemove}>{t('remove')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Channels = ({ channels, currentChannelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSelect = (id) => () => {
    dispatch(channelsSlice.actions.setCurrentChannel(id));
  };

  const handleAdd = () => {
    dispatch(modalSlice.actions.open({ type: 'add' }));
  };

  const handleRename = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalSlice.actions.open({ type: 'rename', context }));
  };

  const handleRemove = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalSlice.actions.open({ type: 'remove' }, context));
  };

  // Гена, вот тут застрял) Пытаюсь сделать, чтобы при первом рендере не срабатывал useEffect
  // Как при componentDidUpdate.
  // Но срабатывает 2 рендера, один сразу и один после получения списка каналов с сервера
  // Подскажи, как правильно обойти?
  // В демо-проекте происходит только один action channelsInfo/setInitialState при загрузке чата
  // Как-будто нет запроса на сервер...
  /*

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };

  const channelsView = useRef(null);
  const isMount = useIsMount();

  useEffect(() => {
    if (!isMount) {
      channelsView
        .current
        ?.lastElementChild
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [channels.length, isMount]);
  */

  return (
    <Col xs={4} md={3} className="border-end p-0 bg-light d-flex flex-column">
      <div className="ps-3 pe-2 pt-5 pb-2 d-flex justify-content-between align-items-center">
        <div className="text-truncate"><b>{t('channels')}</b></div>
        <Button variant="outline-primary" className="rounded-circle p-0 d-flex align-items-center" onClick={handleAdd}>
          <BsPlusCircle />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav
        as="ul"
        className="nav-pills nav-fill p-2 overflow-auto h-100 d-block"
        id="channels-box"
      >
        {channels.map(({ id, name, removable }) => {
          const isActive = id === currentChannelId;
          const variant = isActive ? 'outline-primary' : null;
          const Channel = removable ? RemovableChannel : PersistentChannel;

          return (
            <Nav.Item key={id} className="w-100 my-1" as="li">
              <Channel
                key={id}
                name={name}
                isActive={isActive}
                variant={variant}
                onSelect={handleSelect(Number(id))}
                handleRename={handleRename((Number(id)), name)}
                handleRemove={handleRemove(Number(id), name)}
              />
            </Nav.Item>
          );
        })}
      </Nav>
    </Col>
  );
};

export default Channels;
