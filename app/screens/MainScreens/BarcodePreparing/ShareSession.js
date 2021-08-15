/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import Share from 'react-native-share';
import {readFile, readDir} from 'react-native-fs';
import XLSX from 'xlsx';
import {
  Button,
  Center,
  HStack,
  Heading,
  Modal,
  Pressable,
  ScrollView,
  VStack,
  Box,
  AlertDialog,
  useToast,
  Text,
} from 'native-base';
import {StyleSheet, Platform, View} from 'react-native';
import {Table, Row} from 'react-native-table-component';

import Screen from '../../../layouts/Screen';

import File from '../../../../assets/images/svg/session.svg';
import ShareIcon from '../../../../assets/images/svg/share.svg';
import EyeIcon from '../../../../assets/images/svg/eye.svg';
import Trash from '../../../../assets/images/svg/trash.svg';

var RNFS = require('react-native-fs');

const basePath = Platform.select({
  ios: RNFS.MainBundlePath,
  android: RNFS.ExternalDirectoryPath,
});

const ShareSessions = props => {
  const widthArr = [120, 120, 120, 120, 120, 120, 120];
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectFile] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const onClose = () => setIsOpen(false);
  const readFiles = () => {
    readDir(basePath)
      .then(result => {
        if (result.length > 0) {
          let details = [];
          for (let file of result) {
            if (
              file.name.substr(file.name.length - 4, file.name.length) ===
              'xlsx'
            ) {
              details.push({
                fileName: file.name,
                createdTime: file.mtime?.toString(),
                path: file.path,
                options: {
                  url: 'file:///' + file.path,
                  type: 'application/xlsx',
                },
              });
            }
          }
          setFiles(details);
        } else {
          setFiles([]);
        }
      })
      .catch(err => {
        console.log('[ERROR]:[FETCHING_SAVED_EXCEL_DIRECTORY]', err);
      });
  };

  const onShowFile = () => {
    const filePath = selectedFile.path;
    readFile(filePath, 'ascii')
      .then(excelFile => {
        const workbook = XLSX.read(excelFile, {type: 'binary'});
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const patchedData = XLSX.utils.sheet_to_json(ws, {header: 1});
        const dummyData = patchedData.map((e, index) => {
          if (index !== 0) {
            return e;
          }
        });
        setTags(patchedData[0]);
        setData(dummyData);
        setShowModal(true);
      })
      .catch(err => {
        throw err;
      });
  };

  const onShareFile = () => {
    Share.open(selectedFile.options)
      .then(res => {
        console.log('[SUCCESS]:[SHARE_SESSION]', res);
      })
      .catch(err => {
        console.log('[ERROR]:[SHARE_SESSION]', err);
      });
  };

  const onDeleteFile = index => {
    RNFS.unlink(files[index].path)
      .then(() => {
        console.log('[SUCCESS]:[DELETE_FILE]');
        toast.show({title: 'File is deleted successfully'});
        readFiles();
      })
      .catch(err => {
        console.log('[ERROR]:[DELETE_FILE]', err);
      });
  };

  useEffect(() => {
    readFiles();
  }, []);

  return (
    <Screen
      hasBackButton
      title="SESSIONS"
      errorMessage={null}
      hasHeader={true}
      isLoading={false}>
      {files.length === 0 && (
        <VStack flex={1} w="100%">
          <Center flex={1}>
            <Heading size="md" color="primary.600">
              No sessions
            </Heading>
          </Center>
        </VStack>
      )}
      {files.length >= 1 && (
        <ScrollView flex={1} w="100%" showsVerticalScrollIndicator={false}>
          {files.map((item, index) => (
            <Pressable
              key={`KEY_${index}`}
              mt={3}
              w="100%"
              onPress={() => {
                setSelectedItem(index);
                setSelectFile(item);
              }}>
              <HStack
                alignItems="center"
                w="100%"
                space={1}
                justifyContent="space-between">
                <Box>
                  <HStack alignItems="center">
                    <File width={36} height={36} color="#06b6d4" />
                    <VStack space={2}>
                      <Text style={{fontSize: 12}} color="primary.700">
                        {item.fileName}
                      </Text>
                      <Text style={{fontSize: 12}} color="gray.500">
                        {item.createdTime.substr(0, 21)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                {index === selectedItem && (
                  <Box>
                    <HStack space={3}>
                      <Button
                        p={0}
                        variant="ghost"
                        onPress={() => {
                          onShowFile();
                        }}>
                        <EyeIcon width={16} height={16} color="#06b6d4" />
                      </Button>
                      <Button
                        p={0}
                        variant="ghost"
                        onPress={() => {
                          onShareFile();
                        }}>
                        <ShareIcon width={16} height={16} color="#06b6d4" />
                      </Button>
                      <Button
                        p={0}
                        variant="ghost"
                        onPress={() => {
                          setIsOpen(true);
                        }}>
                        <Trash width={16} height={16} color="#06b6d4" />
                      </Button>
                    </HStack>
                  </Box>
                )}
              </HStack>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <AlertDialog isOpen={isOpen} onClose={onClose} motionPreset={'fade'}>
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Notification
          </AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure? Do you want to delete this file ?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                onClose();
                onDeleteFile(selectedItem);
              }}
              ml={3}>
              Ok
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Saved Items</Modal.Header>
          <Modal.Body>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                  <Row
                    data={tags}
                    widthArr={widthArr}
                    style={styles.header}
                    textStyle={styles.text}
                  />
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                    {data.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          index % 2 && {backgroundColor: '#F7F6E7'},
                        ]}
                        textStyle={styles.text}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="ghost"
              onPress={() => {
                setShowModal(false);
              }}>
              CLOSE
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#808B97'},
  text: {margin: 6},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
});

export default ShareSessions;
