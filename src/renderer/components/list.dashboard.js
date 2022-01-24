import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { StoreContext } from '../stores/store.context';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

export const ListComponent = observer((props) => {
  const { listIndex } = props;
  const { vmix, lists } = useContext(StoreContext);

  const list = lists.lists[listIndex];

  const [listTitles, setListTitles] = useState([]);
  const [selectedListKey, setSelectedListKey] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleListChange = (e) => {
    let key = e.target.value;
    setSelectedListKey(key);
    list.setKey(key);
    let files = list.createFileList();
    list.setFiles(files);
  };

  const doubleClick = (file, i) => {
    vmix.selectInputByIndex(file, i, list.key);
  };

  const singleClick = (i) => {
    setHighlightedIndex(i);
  };

  const next = () => {
    vmix.next(list.key);
  };

  const previous = () => {
    vmix.previous(list.key);
  };

  const removeList = () => {
    lists.removeList(listIndex);
  };

  useEffect(() => {
    const dropzone = document.getElementById('dropzone');

    dropzone.addEventListener('dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    dropzone.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const files = e.dataTransfer.files;
      vmix.handleDroppedFiles(files, list.key);
    });
  }, []);

  useEffect(() => {
    setListTitles(vmix.lists);
    let files = list.createFileList();
    list.setFiles(files);
  }, [JSON.stringify(vmix.lists)]);

  useEffect(() => {
    let w = Math.floor(99 / lists.lists.length);
    let ws = `${w}%`;
    setWidth(ws);
    // console.log(w);
  }, [lists.lists.length]);

  const [width, setWidth] = useState('100%');

  return (
    <>
      <Grid
        item
        style={{
          paddingLeft: 5,
          paddingRight: 5,
          width: width,
          background: '',
          maxWidth: 400,
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          style={{ background: '' }}
        >
          <Grid
            container
            justifyContent="center"
            // alignItems="center"
            style={{ background: '' }}
          >
            <FormControl
              variant="outlined"
              size="small"
              // fullWidth
              style={{ marginTop: 15, maxWidth: 450, minWidth: 200 }}
            >
              <InputLabel>Select List</InputLabel>
              <Select
                value={selectedListKey}
                style={{ width: '100%' }}
                onChange={handleListChange}
              >
                {listTitles.map((list, index) => (
                  <MenuItem value={list.key} key={list.key}>
                    {list.number}: {list.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <div
            id="dropzone"
            style={{
              marginTop: 10,
              width: '100%',
              height: 'calc(100vh - 245px)',
              borderStyle: 'solid',
              borderColor: 'darkorange',
              borderRadius: 10,
              overflow: 'auto',
            }}
          >
            {list.files.map((file, i) => (
              <Typography
                onClick={() => singleClick(i)}
                onDoubleClick={() => doubleClick(file, i)}
                noWrap
                key={i}
                style={{
                  color: file.isSelected ? 'black' : 'white',
                  fontWeight: file.isSelected ? 700 : 300,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: i == highlightedIndex ? 'white' : '#202020',
                  background: file.isSelected ? 'red' : '',
                  marginTop: 5,
                  userSelect: 'none',
                  paddingLeft: 7,
                }}
              >
                {file.title.split('\\')[file.title.split('\\').length - 1]}
              </Typography>
            ))}
          </div>
          <Grid
            container
            justifyContent="space-around"
            style={{ width: '100%' }}
          >
            <Button
              disabled={!list.key}
              onClick={() => previous()}
              variant="contained"
              style={{ width: '40%', marginTop: 10, padding: 20 }}
            >
              Previous
            </Button>
            <Button
              disabled={!list.key}
              onClick={() => next()}
              variant="contained"
              style={{ width: '40%', marginTop: 10 }}
            >
              Next
            </Button>
          </Grid>
          <Grid
            container
            justifyContent="space-around"
            style={{ width: '100%' }}
          >
            <Button
              onClick={() => removeList()}
              variant="outlined"
              style={{ width: '60%', marginTop: 10 }}
            >
              Remove List
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});
