import React from 'react';
import connect from '@vkontakte/vkui-connect';
import { ScreenSpinner, Alert, View, Panel, PanelHeader, Group, InfoRow,FormLayout, FormLayoutGroup, Input,Select,Radio,Textarea,Checkbox, Link, Button,Div, Slider} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';


require('./test.txt');

var user = {first_name: "",last_name:"", sex:0, id:0};


var val = (elem) => {
		console.log(elem)
		return '1';
	}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.reg_fields= ["sex","first_name","last_name","id","myTarget","old","height","weight","sport","dayssport","hoursport","typefig","typejob","dailyActivity","hormonalDisorder","stressLevel","sleep","fatquick","fatchild","girthNeck","girthWaist","girthHits"]
		this.week_fields= ["sex","id","weekNumber","caloriePlank","averageWeight","minWeight","averageStep","rateTrainings","rateNutrition","rateHunger","girthNeck","girthWaist","girthHits"]


		this.state = {
			popout: null,
			activePanel: 'home',
			fetchedUser: null,
			config: {
				urlPhpServer: "https://localhost/"
			},
			formReg: {
				sex:0,
				first_name:'',
				last_name:'',
        registered: -1, //-1 состояние неизвестно,0 - новый, 1- зареган
        message2user: ['','','']
			}
		};

	}

	componentDidMount() {

		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					user=e.detail.data
					this.setState({ fetchedUser: user ,
            config: window.config,
            afterReg:0, //если только что после регистрации
            formReg: {
						sex:user.sex,
						first_name:user.first_name,
						last_name:user.last_name,
						id:user.id
					}});

              this.checkUser();
					break;
				default:

					//console.log(e.detail.type);
			}
		});
		connect.send('VKWebAppGetUserInfo', {});
	}
//сохранение контекста через стрел. ф. или bind
	ChangeSt=(event)=> {
			let arr =this.state.formReg
      if(event.target.type=="checkbox") arr[event.target.name] = event.target.checked
      else arr[event.target.name] = event.target.value

	    this.setState({formReg: arr } )
			console.log(this.state.formReg)
			let t,i=0;
			for (let key in this.state.formReg) {
t+='"'+key+'",'
i++;
}
console.log(t,i)

	}

	checkForm(type){
				switch (type) {
					case 0:
						{ //без этой скобки не работает let
							let checkArray = this.reg_fields
							console.log(checkArray)
							for (let key in this.state.formReg) {
									var index = checkArray.indexOf(key);
									if (index > -1) {
									  checkArray.splice(index, 1);
									}
								}
								if(this.state.formReg.sex==2){
									index = checkArray.indexOf('girthHits');
									if (index > -1) {
										checkArray.splice(index, 1);
									}
								}
								console.log(checkArray)
								if(checkArray.length>0) return false
								else return true
							}
					break;
					case 1:
						{ //без этой скобки не работает let
							let checkArray = this.week_fields
							console.log(checkArray)
							for (let key in this.state.formReg) {
									var index = checkArray.indexOf(key);
									if (index > -1) {
									  checkArray.splice(index, 1);
									}
								}
								if(this.state.formReg.sex==2){
									index = checkArray.indexOf('girthHits');
									if (index > -1) {
										checkArray.splice(index, 1);
									}
								}
								console.log(checkArray)
								if(checkArray.length>0) return false
								else return true
							}
					break;
					default:	return true;
				}

		}

		openDialog (text) {
		    this.setState({ popout:
		      <Alert
		        actions={[{
		          title: 'Close',
		          autoclose: true,
		          style: 'destructive'
		        }]}
		        onClose={ () => this.setState({ popout: null }) }
		      >
		        <h2>Hi!</h2>
		        <div className="content" dangerouslySetInnerHTML={{__html: text}}></div>
		      </Alert>
		    });
		  }

checkUser=()=>{
	this.setState({ popout: <ScreenSpinner /> });
  fetch(this.state.config.urlPhpServer+'checkuser.php?userID='+this.state.formReg.id)
    .then(res => res.text())
    .then(data=> {
			this.setState({popout: null})
      console.log('Request succeeded with response:',data)
      let dataJSON=JSON.parse(data);
			console.log(dataJSON)
      if(dataJSON.reg){
        let sex=(dataJSON.sex==2 | dataJSON.sex==1)? dataJSON.sex : this.state.formReg.sex;
        this.setState({registered: 1, message2user: dataJSON.message2user, formReg:{sex: sex, id: this.state.formReg.id, weekNumber: dataJSON.lastWeek }})
      }
      else
        this.setState({registered: 0})
    }).catch(error => {
			this.openDialog ("ошибка связи с сервером")
      console.log(error);
  });
}

	ajaxSend=(type)=>{
      let counter = 0;
      for (var key in this.state.formReg) {
        counter++;
      }
      /*if (!type && ((counter<20 && this.state.formReg.sex==2) || (counter<22 && this.state.formReg.sex==1)) ||
        type && ((counter<11 && this.state.formReg.sex==2) || (counter<13 && this.state.formReg.sex==1))
      ) {
            this.openDialog("Необходимо заполнить все поля");
      }*/
			if(!this.checkForm(type)){this.openDialog("Необходимо заполнить все поля!");}
      else{
        this.setState({ popout: <ScreenSpinner /> });
        var data = new FormData();
        data.append( "json", JSON.stringify( this.state.formReg ) );
        /* https://ftvkapp.beget.tech/saveUser.php */
        console.log(JSON.stringify( this.state.formReg ));

        if(type) var url = this.state.config.urlPhpServer+"saveweek.php";
        else var url = this.state.config.urlPhpServer+"saveUser.php"

        fetch(url, {
          method: 'post',
          body: data
        })
        .then(res => res.text())
        .then( data=> {
          this.setState({popout: null})
          console.log('Request succeeded with response:', data);
          let dataJSON=JSON.parse(data);
          if(dataJSON['error']){
            this.openDialog(dataJSON['error']);
          }else{
              this.setState({activePanel: 'home',registered: true, afterReg:1, message2user:"Данные записаны. Следите за комментариями от нашей команды =)"})
              this.openDialog("Данные успешно записаны");
          }



        })
        .catch(error => {
					this.openDialog ("ошибка связи с сервером")
          console.log(error);
          this.setState({popout: null})
      });

      }

    return this;
	}

	go= (e)=>{
		this.setState({ activePanel: e.currentTarget.dataset.to })
	};


	Num($inp) {
    if(isNaN(Number($inp))){
      return null;
    }
    else{
      return Number($inp);
    }
	}



	render() {

    // краткость сестра таланта
let $=this.state.formReg;
var Num=this.Num;
var ChangeSt=this.ChangeSt;

		return (

<View activePanel={this.state.activePanel} popout={this.state.popout}>
  <Panel id="home" theme="white">
    <PanelHeader>Фитнес</PanelHeader>

        <Div><InfoRow title="">
           Приветствуем тебя в нашей системе
          </InfoRow>
				</Div>
				{ this.state.message2user ?
				<Div>
					<Div>
						<InfoRow title="Актуальная планка:">
	           {this.state.message2user[0][1]}
	          </InfoRow>
					</Div>
					<Div>
						<InfoRow title="Цель: ">
							 {this.state.message2user[2][1]}
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Рекомендация по планке: ">
							 {this.state.message2user[0][3]}
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Планка по шагам: ">
							 {this.state.message2user[2][3]}
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Комментарий:">
							 {this.state.message2user[0][2]}
						</InfoRow>
					</Div>
					<Div>
						<InfoRow title="Дата проверки:">
							 {this.state.message2user[2][2]}
						</InfoRow>
					</Div>
				</Div>
				:''}

        { this.state.registered==0 ?
		      <Div>
           <Button level="commerce" onClick={() =>this.setState({activePanel: 'newuser'})} >Регистрация</Button>
				</Div>
        :''}

        { !this.state.afterReg & this.state.registered==1 ?
        <Div>
         <Button level="commerce" onClick={() =>this.setState({activePanel: 'everyWeek'})} >Еженедельная анкета</Button>
      </Div>
        :''}

   </Panel>
	 <Panel id="everyWeek" theme="white">
     <PanelHeader>Фитнес</PanelHeader>

         <Div><InfoRow title="">
            Еженедельный отчет
           </InfoRow>
 				</Div>
          <FormLayout id="form3">
            <Select top="Номер недели" placeholder="Не выбрана" name="weekNumber" value={Num($.weekNumber)} onChange={ChangeSt}>
                <option value="1">1 неделя</option>
                 <option value="2">2 неделя</option>
                 <option value="3">3 неделя</option>
                 <option value="4">4 неделя</option>
                 <option value="5">5 неделя</option>
                 <option value="6">6 неделя</option>
                 <option value="7">7 неделя</option>
                 <option value="8">8 неделя</option>
                 <option value="9">9 неделя</option>
                 <option value="10">10 неделя</option>
                 <option value="11">11 неделя</option>
                 <option value="12">12 неделя</option>
                 <option value="13">13 неделя</option>
                 <option value="14">14 неделя</option>
                 <option value="15">15 неделя</option>
								 <option value="16">16 неделя</option>
              </Select>
          <Input type="number" top="Калории по планке" name="caloriePlank"  value={Num($.caloriePlank)} onChange={ChangeSt}/>
          <Input type="number" top="Средний вес за неделю" name="averageWeight" value={Num($.averageWeight)} onChange={ChangeSt}/>
          <Input type="number" top="Минимальный вес за неделю" name="minWeight" value={Num($.minWeight)} onChange={ChangeSt}/>
          <Input type="number" top="Среднее кол. шагов за неделю" name="averageStep" value={Num($.averageStep)} onChange={ChangeSt}/>
          <Select top="Тренировки (оцените по шкале от 0 до 5, где 0-не тренировались, 5 - активно тренировались)"
                placeholder="Ваша оценка"  name="rateTrainings"  value={Num($.rateTrainings)}  onChange={ChangeSt}>
               <option value="1">1</option>
               <option value="2">2</option>
               <option value="3">3</option>
               <option value="4">4</option>
               <option value="5">5</option>
             </Select>

          <Select top="Питание (оцените по шкале 0-5 насколько точно вы придерживались макросов и рекомендаций)"
                placeholder="Ваша оценка"  name="rateNutrition"  value={Num($.rateNutrition)}  onChange={ChangeSt}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
            <Select top="Оцените уровень голода по шкале (от 1 до 5):"
                  placeholder="Ваша оценка"  name="rateHunger"  value={Num($.rateHunger)}  onChange={ChangeSt}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
					<Input top="Обхват шеи, см"  type="number" name="girthNeck" value={Num($.girthNeck)} onChange={ChangeSt}  />
					<Input top="Обхват талии, см"  type="number" name="girthWaist" value={Num($.girthWaist)} onChange={ChangeSt} />
					{this.state.formReg.sex=='1' ?
				            <Input  top="Обхват бедер, см"  type="number" name="girthHits" value={Num($.girthHits)} onChange={ChangeSt} />
				 	:''}
          { this.state.formReg.sex=='1' ?
      		          <Checkbox name="menses" value="да" checked={$.menses} onChange={ChangeSt}>Были ли месячные на этой неделе? </Checkbox>
      		:''}

              <Checkbox name="foto" value="да" checked={$.foto} onChange={ChangeSt}>Отправляли свое фото нам? </Checkbox>
              <Textarea top="Комментарий по неделе" placeholder="" name="comment"  value={$.comment} onChange={ChangeSt}/>

              <Button level="commerce" onClick={() =>this.ajaxSend(1)}  >Отправить данные</Button>

        </FormLayout>

    </Panel>

   <Panel id="newuser" theme="white">
    <PanelHeader>Регистрация</PanelHeader>
    	 <Group>
        <Div><InfoRow title="Регистрация">
          Для регистрации просим ответить на несколько вопросов:
          </InfoRow>
			   </Div>
      </Group>
			<FormLayout id="form1">


			<Input top="Имя" name="first_name"  value={$.first_name} onChange={ChangeSt}/>
      <Input top="Фамилия" name="last_name" value={$.last_name} onChange={ChangeSt}/>

       <Select top="Пол" placeholder="Выберите пол"  name="sex" value={$.sex} onChange={ChangeSt}>
        <option value="2">Мужской</option>
        <option value="1">Женский</option>
      </Select>


	  <Select top="Цель" placeholder="Ваша цель" name="myTarget" value={$.myTarget} onChange={ChangeSt}>
        <option value="Похудение">Похудение</option>
        <option value="Реверс">Реверс</option>
        <option value="Набор массы">Набор массы</option>
      </Select>
       <Slider step={1} min={16} max={70} top={"Полных лет " + (($.old)?$.old:"") } name="old" value={$.old}  onChange={val =>{$['old']=val;this.setState({formReg: $})}} />

       <Input top="Рост" type="number" name="height" value={Num($.height)} onChange={ChangeSt}  />
       <Input top="Вес" type="number"  name="weight" value={Num($.weight)} onChange={ChangeSt}/>

	<Input top="Вид спорта"  name="sport" value={$.sport} onChange={ChangeSt}/>
	<Input top="Количество дней с тренировками" name="dayssport" value={$.dayssport} onChange={ChangeSt} />
    <Input top="Сколько минут (в среднем) длится одна тренировка" type="number" name="hoursport" value={Num($.hoursport)} onChange={ChangeSt} />


	  <Select top="Телосложение" placeholder="Тип фигуры" name="typefig" value={$.typefig} onChange={ChangeSt} >
        <option value="Эктоморф/Худощавый">Эктоморф/Худощавый</option>
        <option value="Мышечный/средний">Мышечный/средний</option>
        <option value="Эндоморф/полный">Эндоморф/полный</option>
      </Select>
      <Select top="Характер работы" placeholder="Выберите" name="typejob" value={$.typejob} onChange={ChangeSt}>
        <option value="офис">Малоподвижная, сидячая, офис</option>
        <option value="легкая активность">Лёгкая активность/разъездная работа/весь день на ногах </option>
        <option value="Активный">Активный - лёгкий физический труд - повара/парикмахеры</option>
        <option value="Тяжелый труд">Тяжелый физический труд/строительные работы/грузчик</option>
      </Select>
			<Select top="Повседневная активность" placeholder="Выберите" name="dailyActivity" value={$.dailyActivity} onChange={ChangeSt}>
        <option value="Минимальная">Минимальная (сидячая работа/ноль движения)</option>
        <option value="Ниже среднего">Ниже среднего (прогулки, ежедневный поход за покупками)</option>
        <option value="На ногах">На ногах большую часть дня</option>
        <option value="ЛегкиЙ труд">Легкий ручной труд</option>
				<option value="Тяжелый труд">Тяжелый ручной труд</option>
      </Select>
      <Input top="Есть ли у Вас гормональные нарушения? Если нет - поставьте 'нет'" name="hormonalDisorder" value={$.hormonalDisorder} onChange={ChangeSt}/>


	<Select top="Уровень стресса" placeholder="Выберите" name="stressLevel" value={$.stressLevel} onChange={ChangeSt}>
				<option value="Без стресса">Без стресса (только переживаю очень во время просмотра новостей по телевизору)</option>
				<option value="По случаю">По случаю (например студент во время сессии)</option>
				<option value="Средний">Средний (полноценная работа с дедлайнами и контактами с другими людьми)</option>
				<option value="Высокий">Высокий (руководящая работа/жёсткий график/высокая ответственность)</option>
			</Select>

		<Slider step={0.5} min={4} max={14} top={"Количество часов сна в среднем " + (($.sleep)?$.sleep:"") } value={Num($.sleep)} onChange={val =>{$['sleep']=val;this.setState({formReg: $})}} />


		 { this.state.formReg.myTarget=="Похудение" ?
       <Select top="Вы растолстели быстро (3-6 мес.) или вес/жир копился годами?" placeholder="Выберите"
				 name="fatquick" value={$.fatquick} onChange={ChangeSt}>
        <option value="Быстро">Быстро</option>
        <option value="Медленно">Медленно</option>
				<option value="Нет проблемы">Нет проблемы/я на массонабор</option>
      	</Select>: null }
      	 { this.state.formReg.myTarget=="Похудение" ?
      	<Select top="Были ли Вы в детстве полным ребенком?" placeholder="Выберите"
					name="fatchild" value={$.fatchild} onChange={ChangeSt}>
        <option value="Нет">Нет</option>
        <option value="Да">Да</option>
      	</Select> : null }
				{ this.state.formReg.sex=='1' ?
		          <Checkbox name="menses" value="да" checked={$.menses} onChange={ChangeSt}>Были ли месячные на этой неделе? </Checkbox>
		 					:''}

              <Checkbox name="foto" value="да" checked={$.foto} onChange={ChangeSt}>Отправляли свое фото нам? </Checkbox>
      <Button size="xl" onClick={() =>this.setState({activePanel: 'measurement'})}>Перейти к измерениям</Button>
    </FormLayout>
  </Panel>
  <Panel id="measurement" theme="white">
    <PanelHeader>Измерения</PanelHeader>
 			 <Div>
					<InfoRow title="">
				Измерьте свои характеристики согласно инструкциям на картинках
				</InfoRow>
					<FormLayout id="form2">
					<InfoRow title="">
					1) Измерь сантиметром окружность шеи в <b>самом узком</b> месте:
					</InfoRow>
         <div style={{'text-align': "center"}}>
           <br /><img src={this.state.config.urlPhpServer+'img/w_neck.jpg'} width="60%" /><br /><br />
         </div>
         <Input top="Обхват шеи, см."  type="number" name="girthNeck" value={$.girthNeck} onChange={ChangeSt}  />
					<InfoRow title="">
				 	2) Измерь сантиметром окружность талии - для женщин в <b>самом узком</b> месте, для мужчин <b>на уровне пупка</b>:
				 	</InfoRow>
         <div style={{'text-align': "center"}}>
           <br /><img src={this.state.config.urlPhpServer+'img/w_waist.jpg'} width="60%"  /><br /><br />
         </div>
         <Input top="Обхват талии, см."  type="number" name="girthWaist" value={$.girthWaist} onChange={ChangeSt} />
	 { this.state.formReg.sex=='1' ?
		 <div>
			 <InfoRow title="">
			 3) Измерь сантиметром окружность бедер в <b>самом широком</b> месте
			 </InfoRow>
         <div style={{'text-align': "center"}} >
           <br /><img src={this.state.config.urlPhpServer+'img/w_hips.jpg'} width="60%"  /><br /><br />

				 	</div>
           <Input  top="Обхват бедер, см"  type="number" name="girthHits" value={$.girthHits} onChange={ChangeSt} />
				 	</div>
					:''}
 				 <Div>
					 <Button level="outline" onClick={() =>this.setState({activePanel: 'newuser'})} style={{ marginRight: 8 }}>Назад</Button>
           <Button level="commerce" onClick={() =>this.ajaxSend(0)}  >Завершить регистрацию</Button>
				</Div>
			</FormLayout>
		</Div>
   </Panel>
</View>


		);
	}
}

export default App;
